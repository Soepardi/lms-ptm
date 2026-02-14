-- jangan lupa dirun tiap perubahan ye

create extension if not exists "uuid-ossp";


create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  role text check (role in ('student', 'instructor', 'admin')) default 'student',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'role');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


create table public.courses (
  id uuid default uuid_generate_v4() primary key,
  instructor_id uuid references public.profiles(id) not null,
  title text not null,
  description text,
  thumbnail_url text,
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.courses enable row level security;

create policy "Courses are viewable by everyone." on public.courses
  for select using (true);

create policy "Instructors can insert courses." on public.courses
  for insert with check (auth.uid() = instructor_id);

create policy "Instructors can update own courses." on public.courses
  for update using (auth.uid() = instructor_id);

create policy "Instructors can delete own courses." on public.courses
  for delete using (auth.uid() = instructor_id);

create table public.modules (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.modules enable row level security;

create policy "Modules are viewable by everyone." on public.modules
  for select using (true);

create policy "Instructors can insert modules." on public.modules
  for insert with check (
    exists ( select 1 from public.courses where id = course_id and instructor_id = auth.uid() )
  );

create policy "Instructors can update modules." on public.modules
  for update using (
    exists ( select 1 from public.courses where id = course_id and instructor_id = auth.uid() )
  );

create policy "Instructors can delete modules." on public.modules
  for delete using (
    exists ( select 1 from public.courses where id = course_id and instructor_id = auth.uid() )
  );

create table public.lessons (
  id uuid default uuid_generate_v4() primary key,
  module_id uuid references public.modules(id) on delete cascade not null,
  title text not null,
  content text,
  video_url text,
  attachment_url text,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.lessons enable row level security;

create policy "Lessons are viewable by everyone." on public.lessons
  for select using (true);

create policy "Instructors can insert lessons." on public.lessons
  for insert with check (
    exists ( 
      select 1 from public.modules m
      join public.courses c on m.course_id = c.id
      where m.id = module_id and c.instructor_id = auth.uid()
    )
  );

create policy "Instructors can update lessons." on public.lessons
  for update using (
    exists ( 
      select 1 from public.modules m
      join public.courses c on m.course_id = c.id
      where m.id = module_id and c.instructor_id = auth.uid()
    )
  );

create policy "Instructors can delete lessons." on public.lessons
  for delete using (
    exists ( 
      select 1 from public.modules m
      join public.courses c on m.course_id = c.id
      where m.id = module_id and c.instructor_id = auth.uid()
    )
  );

create table public.enrollments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  course_id uuid references public.courses(id) not null,
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  progress_pct integer default 0,
  unique(user_id, course_id)
);

alter table public.enrollments enable row level security;

create policy "Users can view own enrollments." on public.enrollments
  for select using (auth.uid() = user_id);

create policy "Users can enroll themselves." on public.enrollments
  for insert with check (auth.uid() = user_id);

create table public.lesson_completions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  lesson_id uuid references public.lessons(id) not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, lesson_id)
);

alter table public.lesson_completions enable row level security;

create policy "Users can view own completions." on public.lesson_completions
  for select using (auth.uid() = user_id);

create policy "Users can mark lessons complete." on public.lesson_completions
  for insert with check (auth.uid() = user_id);


create table public.assignments (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  description text,
  due_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.assignments enable row level security;

create policy "Assignments are viewable by everyone." on public.assignments
  for select using (true);

create policy "Instructors can insert assignments." on public.assignments
  for insert with check (
    exists ( select 1 from public.courses where id = course_id and instructor_id = auth.uid() )
  );

create policy "Instructors can update assignments." on public.assignments
  for update using (
    exists ( select 1 from public.courses where id = course_id and instructor_id = auth.uid() )
  );

create policy "Instructors can delete assignments." on public.assignments
  for delete using (
    exists ( select 1 from public.courses where id = course_id and instructor_id = auth.uid() )
  );

create table public.submissions (
  id uuid default uuid_generate_v4() primary key,
  assignment_id uuid references public.assignments(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  content text, 
  file_url text,
  grade integer,
  feedback text,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null
);


alter table public.submissions enable row level security;


create policy "Instructors can view all submissions for their courses." on public.submissions
  for select using (
    exists (
      select 1 from public.assignments a
      join public.courses c on a.course_id = c.id
      where a.id = assignment_id and c.instructor_id = auth.uid()
    )
  );

create policy "Students can view their own submissions." on public.submissions
  for select using (auth.uid() = user_id);

create policy "Students can insert their own submissions." on public.submissions
  for insert with check (auth.uid() = user_id);

create policy "Instructors can update submissions (grade/feedback)." on public.submissions
  for update using (
    exists (
      select 1 from public.assignments a
      join public.courses c on a.course_id = c.id
      where a.id = assignment_id and c.instructor_id = auth.uid()
    )
  );
