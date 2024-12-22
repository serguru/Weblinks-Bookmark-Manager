﻿using Microsoft.EntityFrameworkCore;
using server.Data.Models;

namespace server.Data;

public class PagesRepository : IPagesRepository
{
    private readonly Links3dbContext dbContext;

    public PagesRepository(Links3dbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<List<PageModel>> GetAllPagesAsync(int? accountId = null)
    {
        var pages = await dbContext.Pages.
            Select(x => new PageModel
            { 
                Id = x.Id,
                AccountId = x.AccountId,
                PagePath = x.PagePath,
                Caption = x.Caption,
            })
            .ToListAsync();

        return pages;
    }


    //public async Task<CourseDetailModel> GetCourseDetailAsync(int courseId)
    //{
    //    var course = await dbContext.Courses
    //        .Include(c => c.Category)
    //        .Include(c => c.Reviews)
    //        .Include(c => c.SessionDetails)
    //        .Where(c => c.CourseId == courseId)
    //        .Select(c => new CourseDetailModel
    //        {
    //            CourseId = c.CourseId,
    //            Title = c.Title,
    //            Description = c.Description,
    //            Price = c.Price,
    //            CourseType = c.CourseType,
    //            SeatsAvailable = c.SeatsAvailable,
    //            Duration = c.Duration,
    //            CategoryId = c.CategoryId,
    //            InstructorId = c.InstructorId,
    //            InstructorUserId = c.Instructor.UserId,
    //            StartDate = c.StartDate,
    //            EndDate = c.EndDate,
    //            Thumbnail = c.Thumbnail,
    //            Category = new CourseCategoryModel
    //            {
    //                CategoryId = c.Category.CategoryId,
    //                CategoryName = c.Category.CategoryName,
    //                Description = c.Category.Description
    //            },
    //            Reviews = c.Reviews.Select(r => new UserReviewModel
    //            {
    //                CourseId = r.CourseId,
    //                ReviewId = r.ReviewId,
    //                UserId = r.UserId,
    //                UserName = r.User.DisplayName,
    //                Rating = r.Rating,
    //                Comments = r.Comments,
    //                ReviewDate = r.ReviewDate
    //            }).OrderByDescending(o => o.Rating).Take(10).ToList(),
    //            SessionDetails = c.SessionDetails.Select(sd => new SessionDetailModel
    //            {
    //                SessionId = sd.SessionId,
    //                CourseId = sd.CourseId,
    //                Title = sd.Title,
    //                Description = sd.Description,
    //                VideoUrl = sd.VideoUrl,
    //                VideoOrder = sd.VideoOrder
    //            }).OrderBy(o => o.VideoOrder).ToList()
    //            ,
    //            UserRating = new UserRatingModel
    //            {
    //                CourseId = c.CourseId,
    //                AverageRating = c.Reviews.Any() ? Convert.ToDecimal(c.Reviews.Average(r => r.Rating)) : 0,
    //                TotalRating = c.Reviews.Count
    //            }
    //        })
    //        .FirstOrDefaultAsync();

    //    return course;
    //}

    //public async Task<List<CourseModel>> GetAllCoursesAsync(int? categoryId = null)
    //{
    //    var query = dbContext.Courses
    //        .Include(c => c.Category)
    //        .AsQueryable();

    //    // Apply the filter if categoryId is provided
    //    if (categoryId.HasValue)
    //    {
    //        query = query.Where(c => c.CategoryId == categoryId.Value);
    //    }

    //    var courses = await query
    //        .Select(s => new CourseModel
    //        {
    //            CourseId = s.CourseId,
    //            Title = s.Title,
    //            Description = s.Description,
    //            Price = s.Price,
    //            CourseType = s.CourseType,
    //            SeatsAvailable = s.SeatsAvailable,
    //            Duration = s.Duration,
    //            CategoryId = s.CategoryId,
    //            InstructorId = s.InstructorId,
    //            Thumbnail = s.Thumbnail,
    //            InstructorUserId = s.Instructor.UserId,
    //            StartDate = s.StartDate,
    //            EndDate = s.EndDate,
    //            Category = new CourseCategoryModel
    //            {
    //                CategoryId = s.Category.CategoryId,
    //                CategoryName = s.Category.CategoryName,
    //                Description = s.Category.Description
    //            },
    //            UserRating = new UserRatingModel
    //            {
    //                CourseId = s.CourseId,
    //                AverageRating = s.Reviews.Any() ? Convert.ToDecimal(s.Reviews.Average(r => r.Rating)) : 0,
    //                TotalRating = s.Reviews.Count
    //            }
    //        })
    //        .ToListAsync();

    //    return courses;
    //}

    //public async Task AddCourseAsync(Course course)
    //{
    //    await dbContext.Courses.AddAsync(course);
    //    await dbContext.SaveChangesAsync();
    //}

    //public async Task UpdateCourseAsync(Course course)
    //{
    //    dbContext.Courses.Update(course);
    //    await dbContext.SaveChangesAsync();
    //}

    //public async Task DeleteCourseAsync(int courseId)
    //{
    //    var course = await GetCourseByIdAsync(courseId);
    //    if (course != null)
    //    {
    //        dbContext.Courses.Remove(course);
    //        await dbContext.SaveChangesAsync();
    //    }
    //}
    //public async Task<Course> GetCourseByIdAsync(int courseId)
    //{
    //    return await dbContext.Courses
    //        .Include(c => c.SessionDetails)
    //        //.Include(c => c.Category)
    //        .FirstOrDefaultAsync(c => c.CourseId == courseId);
    //}
    //public void RemoveSessionDetail(SessionDetail sessionDetail)
    //{
    //    dbContext.SessionDetails.Remove(sessionDetail);
    //}

    //public Task<List<Instructor>> GetAllInstructorsAsync()
    //{
    //    return dbContext.Instructors.ToListAsync();
    //}

    //public async Task<bool> UpdateCourseThumbnail(string courseThumbnailUrl, int courseId)
    //{
    //    var course = await dbContext.Courses.FindAsync(courseId);
    //    if (course != null)
    //    {
    //        course.Thumbnail = courseThumbnailUrl;
    //    }

    //    return await dbContext.SaveChangesAsync() > 0;
    //}
}
