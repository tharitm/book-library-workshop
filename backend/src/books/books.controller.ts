import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UseGuards,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { SearchBookDto } from './dto/search-book.dto';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';
import { AuthGuard } from '@/auth/guards/auth.guard';

@ApiTags('books')
@Controller('books')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({ status: 201, description: 'Book created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Book with ISBN already exists' })
  async create(@Body(ValidationPipe) createBookDto: CreateBookDto) {
    const book = await this.booksService.create(createBookDto);
    return {
      success: true,
      data: book,
      message: 'Book created successfully',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all books with search and pagination' })
  @ApiResponse({ status: 200, description: 'Books retrieved successfully' })
  async findAll(@Query(ValidationPipe) searchDto: SearchBookDto) {
    const result = await this.booksService.findAll(searchDto);
    return {
      success: true,
      data: result.books,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
      message: 'Books retrieved successfully',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book by ID' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({ status: 200, description: 'Book retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async findOne(@Param('id') id: string) {
    const book = await this.booksService.findOne(id);
    return {
      success: true,
      data: book,
      message: 'Book retrieved successfully',
    };
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a book' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({ status: 200, description: 'Book updated successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  @ApiResponse({ status: 409, description: 'ISBN conflict' })
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateBookDto: UpdateBookDto,
  ) {
    const book = await this.booksService.update(id, updateBookDto);
    return {
      success: true,
      data: book,
      message: 'Book updated successfully',
    };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a book' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({ status: 204, description: 'Book deleted successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete book with active borrows' })
  async remove(@Param('id') id: string) {
    await this.booksService.remove(id);
  }

  @Post(':id/upload-cover')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: './public/uploads/covers',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  @ApiOperation({ summary: 'Upload cover image for a book' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({ status: 200, description: 'Cover image uploaded successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  @ApiResponse({ status: 400, description: 'Invalid file format or size' })
  async uploadCover(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const coverImagePath = `/uploads/covers/${file.filename}`;
    const updatedBook = await this.booksService.updateCoverImage(id, coverImagePath);

    return {
      message: 'Cover image uploaded successfully',
      book: updatedBook,
      coverImagePath,
    };
  }

  @Post(':id/borrow')
  @ApiOperation({ summary: 'Borrow a book' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({ status: 201, description: 'Book borrowed successfully' })
  @ApiResponse({ status: 400, description: 'Book not available' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async borrow(
    @Param('id') id: string,
    @Body(ValidationPipe) borrowData: BorrowBookDto,
  ) {
    const borrowRecord = await this.booksService.borrow(id, borrowData);
    return {
      success: true,
      data: borrowRecord,
      message: 'Book borrowed successfully',
    };
  }

  @Post(':id/return')
  @ApiOperation({ summary: 'Return a borrowed book' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({ status: 200, description: 'Book returned successfully' })
  @ApiResponse({ status: 404, description: 'Book or borrow record not found' })
  async returnBook(
    @Param('id') id: string,
    @Body(ValidationPipe) returnData: ReturnBookDto,
  ) {
    const borrowRecord = await this.booksService.returnBook(id, returnData);
    return {
      success: true,
      data: borrowRecord,
      message: 'Book returned successfully',
    };
  }

  @Get(':id/borrow-history')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get borrow history for a book' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({ status: 200, description: 'Borrow history retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async getBorrowHistory(@Param('id') id: string) {
    const history = await this.booksService.getBorrowHistory(id);
    return {
      success: true,
      data: history,
      message: 'Borrow history retrieved successfully',
    };
  }

  @Post('upload-cover')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads/covers',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|svg\+xml)$/)) {
          callback(null, true);
        } else {
          callback(new Error('Only image files are allowed!'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  @ApiOperation({ summary: 'Upload cover image' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Cover image uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file format or size' })
  async uploadCoverImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const coverImagePath = `/uploads/covers/${file.filename}`;

    return {
      message: 'Cover image uploaded successfully',
      coverImage: coverImagePath,
    };
  }



  @Get('borrowed/list')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all borrowed books (not yet returned)' })
  @ApiResponse({ status: 200, description: 'Borrowed books retrieved successfully' })
  async getBorrowedBooks() {
    const borrowedBooks = await this.booksService.getBorrowedBooks();
    return {
      success: true,
      data: borrowedBooks,
      message: 'Borrowed books retrieved successfully',
    };
  }

  @Get('returned/list')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all returned books' })
  @ApiResponse({ status: 200, description: 'Returned books retrieved successfully' })
  async getReturnedBooks() {
    const returnedBooks = await this.booksService.getReturnedBooks();
    return {
      success: true,
      data: returnedBooks,
      message: 'Returned books retrieved successfully',
    };
  }
}