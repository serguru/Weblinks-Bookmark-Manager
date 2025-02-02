using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using server.Data.Entities;

namespace server.Data;

public partial class Links3dbContext : DbContext
{
    public Links3dbContext()
    {
    }

    public Links3dbContext(DbContextOptions<Links3dbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Account> Accounts { get; set; }

    public virtual DbSet<ArchiveTask> ArchiveTasks { get; set; }

    public virtual DbSet<EventType> EventTypes { get; set; }

    public virtual DbSet<History> Histories { get; set; }

    public virtual DbSet<Lcolumn> Lcolumns { get; set; }

    public virtual DbSet<Link> Links { get; set; }

    public virtual DbSet<Lrow> Lrows { get; set; }

    public virtual DbSet<OperTask> OperTasks { get; set; }

    public virtual DbSet<Page> Pages { get; set; }

    public virtual DbSet<TaskType> TaskTypes { get; set; }

    public virtual DbSet<UserMessage> UserMessages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("pk_accounts_id");

            entity.ToTable("accounts", "weblinks");

            entity.HasIndex(e => e.UserEmail, "uq_accounts_email").IsUnique();

            entity.HasIndex(e => e.UserName, "uq_accounts_name").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.FirstName)
                .HasMaxLength(100)
                .HasColumnName("firstName");
            entity.Property(e => e.HashedPassword).HasColumnName("hashedPassword");
            entity.Property(e => e.IsAdmin).HasColumnName("isAdmin");
            entity.Property(e => e.LastName)
                .HasMaxLength(100)
                .HasColumnName("lastName");
            entity.Property(e => e.Salt)
                .HasMaxLength(24)
                .HasColumnName("salt");
            entity.Property(e => e.Settings).HasColumnName("settings");
            entity.Property(e => e.UserEmail)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("userEmail");
            entity.Property(e => e.UserName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("userName");
        });

        modelBuilder.Entity<ArchiveTask>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("pk_archiveTasks_id");

            entity.ToTable("archiveTasks", "weblinks");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Comment).HasColumnName("comment");
            entity.Property(e => e.CompletedUtcDate)
                .HasDefaultValueSql("((sysdatetimeoffset() AT TIME ZONE 'UTC'))")
                .HasColumnName("completedUtcDate");
            entity.Property(e => e.HistoryId).HasColumnName("historyId");
            entity.Property(e => e.SentEmailBody).HasColumnName("sentEmailBody");
            entity.Property(e => e.SentEmailSubject).HasColumnName("sentEmailSubject");
            entity.Property(e => e.TaskTypeId).HasColumnName("taskTypeId");

            entity.HasOne(d => d.History).WithMany(p => p.ArchiveTasks)
                .HasForeignKey(d => d.HistoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_archiveTasks_historyId");

            entity.HasOne(d => d.TaskType).WithMany(p => p.ArchiveTasks)
                .HasForeignKey(d => d.TaskTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_archiveTasks_taskTypeId");
        });

        modelBuilder.Entity<EventType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("pk_eventType_id");

            entity.ToTable("eventType", "weblinks");

            entity.HasIndex(e => e.TypeName, "uq_eventType_name").IsUnique();

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.TypeName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("typeName");
        });

        modelBuilder.Entity<History>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("pk_history_id");

            entity.ToTable("history", "weblinks");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Comment).HasColumnName("comment");
            entity.Property(e => e.EventTypeId).HasColumnName("eventTypeId");
            entity.Property(e => e.UserEmail)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("userEmail");
            entity.Property(e => e.UtcDate)
                .HasDefaultValueSql("((sysdatetimeoffset() AT TIME ZONE 'UTC'))")
                .HasColumnName("utcDate");

            entity.HasOne(d => d.EventType).WithMany(p => p.Histories)
                .HasForeignKey(d => d.EventTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_history_eventTypeId");
        });

        modelBuilder.Entity<Lcolumn>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("pk_lcolumns_id");

            entity.ToTable("lcolumns", "weblinks");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Caption)
                .HasMaxLength(50)
                .HasColumnName("caption");
            entity.Property(e => e.RowId).HasColumnName("rowId");

            entity.HasOne(d => d.Row).WithMany(p => p.Lcolumns)
                .HasForeignKey(d => d.RowId)
                .HasConstraintName("fk_lcolumns_row_id");
        });

        modelBuilder.Entity<Link>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("pk_links_id");

            entity.ToTable("links", "weblinks");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AUrl).HasColumnName("aUrl");
            entity.Property(e => e.Caption)
                .HasMaxLength(50)
                .HasColumnName("caption");
            entity.Property(e => e.ColumnId).HasColumnName("columnId");

            entity.HasOne(d => d.Column).WithMany(p => p.Links)
                .HasForeignKey(d => d.ColumnId)
                .HasConstraintName("fk_links_column_id");
        });

        modelBuilder.Entity<Lrow>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("pk_lrows_id");

            entity.ToTable("lrows", "weblinks");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Caption)
                .HasMaxLength(50)
                .HasColumnName("caption");
            entity.Property(e => e.PageId).HasColumnName("pageId");

            entity.HasOne(d => d.Page).WithMany(p => p.Lrows)
                .HasForeignKey(d => d.PageId)
                .HasConstraintName("fk_lrows_page_id");
        });

        modelBuilder.Entity<OperTask>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("pk_operTasks_id");

            entity.ToTable("operTasks", "weblinks");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.HistoryId).HasColumnName("historyId");
            entity.Property(e => e.TaskTypeId).HasColumnName("taskTypeId");

            entity.HasOne(d => d.History).WithMany(p => p.OperTasks)
                .HasForeignKey(d => d.HistoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_operTasks_historyId");

            entity.HasOne(d => d.TaskType).WithMany(p => p.OperTasks)
                .HasForeignKey(d => d.TaskTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_operTasks_taskTypeId");
        });

        modelBuilder.Entity<Page>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("pk_pages_id");

            entity.ToTable("pages", "weblinks");

            entity.HasIndex(e => new { e.AccountId, e.PagePath }, "uq_page_path").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AccountId).HasColumnName("accountId");
            entity.Property(e => e.Caption)
                .HasMaxLength(50)
                .HasColumnName("caption");
            entity.Property(e => e.IsPublic).HasColumnName("isPublic");
            entity.Property(e => e.IsReadOnly).HasColumnName("isReadOnly");
            entity.Property(e => e.PageDescription).HasColumnName("pageDescription");
            entity.Property(e => e.PagePath)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("pagePath");

            entity.HasOne(d => d.Account).WithMany(p => p.Pages)
                .HasForeignKey(d => d.AccountId)
                .HasConstraintName("fk_pages_account_id");
        });

        modelBuilder.Entity<TaskType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("pk_taskType_id");

            entity.ToTable("taskType", "weblinks");

            entity.HasIndex(e => e.TypeName, "uq_taskType_name").IsUnique();

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.EmailSubject).HasColumnName("emailSubject");
            entity.Property(e => e.EmailTemplate).HasColumnName("emailTemplate");
            entity.Property(e => e.TypeName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("typeName");
        });

        modelBuilder.Entity<UserMessage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("pk_userMessages_id");

            entity.ToTable("userMessages", "weblinks");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AccountId).HasColumnName("accountId");
            entity.Property(e => e.Amessage).HasColumnName("amessage");
            entity.Property(e => e.Asubject).HasColumnName("asubject");
            entity.Property(e => e.UtcDate)
                .HasDefaultValueSql("((sysdatetimeoffset() AT TIME ZONE 'UTC'))")
                .HasColumnName("utcDate");

            entity.HasOne(d => d.Account).WithMany(p => p.UserMessages)
                .HasForeignKey(d => d.AccountId)
                .HasConstraintName("fk_userMessages_accountId");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
