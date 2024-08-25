import { Injectable, NotFoundException } from '@nestjs/common';
import { writeFile } from 'fs/promises';
import * as path from 'path';
import * as fs from 'fs';
import { unlink } from 'fs/promises';

@Injectable()
export class FileService {
  async uploadFile(file: Express.Multer.File, filePath: string) {
    const fullPath = path.resolve(filePath);

    if (fs.existsSync(fullPath)) {
      await unlink(fullPath);
      return writeFile(filePath, file.buffer);
    }
    return writeFile(filePath, file.buffer);
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.resolve(filePath);

    if (fs.existsSync(fullPath)) {
      await unlink(fullPath);
    } else {
      throw new NotFoundException('File not found');
    }
  }
}
