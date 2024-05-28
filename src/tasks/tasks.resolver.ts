import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';

@Resolver(() => Task)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @Mutation(() => Task)
  createTask(
    @Context() context,
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
  ) {
    const authId = context.req.user.sub;
    return this.tasksService.create(authId, createTaskInput);
  }

  @Query(() => Task, { name: 'task' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.tasksService.findOne(id);
  }

  @Mutation(() => Task)
  updateTask(
    @Context() context,
    @Args('updateTaskInput') updateTaskInput: UpdateTaskInput,
  ) {
    const authId = context.req.user.sub;
    return this.tasksService.update(authId, updateTaskInput);
  }

  @Mutation(() => Boolean)
  removeTask(@Args('id', { type: () => Int }) id: number) {
    return this.tasksService.remove(id);
  }
}
