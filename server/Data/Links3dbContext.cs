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

    public virtual DbSet<Page> Pages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__accounts__3213E83F9936FDE0");

            entity.ToTable("accounts");

            entity.HasIndex(e => e.UserName, "UQ__accounts__66DCF95C7C219D95").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.FirstName)
                .HasMaxLength(100)
                .HasColumnName("firstName");
            entity.Property(e => e.HashedPassword)
                .HasMaxLength(64)
                .HasColumnName("hashedPassword");
            entity.Property(e => e.LastName)
                .HasMaxLength(100)
                .HasColumnName("lastName");
            entity.Property(e => e.Salt)
                .HasMaxLength(16)
                .HasColumnName("salt");
            entity.Property(e => e.UserName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("userName");
        });

        modelBuilder.Entity<Page>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__pages__3213E83F4C389E2C");

            entity.ToTable("pages");

            entity.HasIndex(e => new { e.AccountId, e.PagePath }, "uq_path").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AccountId).HasColumnName("accountId");
            entity.Property(e => e.Caption)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("caption");
            entity.Property(e => e.PagePath)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("pagePath");

        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
