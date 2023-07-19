import { CharactersOfSkill } from '@/models/characters-of-skill.model';
import { CharactersOfSkillService } from '@/services/characters-of-skill.service';
import { Body, Controller, Delete, Get, Param, Post, Put, QueryParam } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/characters_of_skill')
export class CharactersOfSkillController {
  constructor(public service: CharactersOfSkillService) {}

  @Get('/')
  @OpenAPI({ summary: 'Get characters_of_skill list' })
  async findAll(
    @QueryParam('page') page: number,
    @QueryParam('limit') limit: number,
    @QueryParam('order') order: string,
    @QueryParam('search') search: string,
  ) {
    try {
      return this.service.findAll(page, limit, order, search);
    } catch (error) {
      return { error };
    }
  }

  @Get('/:id')
  @OpenAPI({ summary: 'Get characters_of_skill by id' })
  async findById(@Param('id') id: number) {
    try {
      return this.service.findById(id);
    } catch (error) {
      return { error };
    }
  }

  @Post('/')
  @OpenAPI({ summary: 'Create characters_of_skill' })
  async create(@Body({ required: true }) body: CharactersOfSkill) {
    try {
      return this.service.create(body);
    } catch (error) {
      return { error };
    }
  }

  @Put('/:id')
  @OpenAPI({ summary: 'Update characters_of_skill' })
  async update() {
    try {
    } catch (error) {
      return { error };
    }
  }

  @Delete('/:id')
  @OpenAPI({ summary: 'Delete characters_of_skill' })
  async delete(@Param('id') id: number) {
    try {
      return this.service.delete(id);
    } catch (error) {
      return { error };
    }
  }
}
