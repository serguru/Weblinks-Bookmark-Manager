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

    public virtual DbSet<Lcolumn> Lcolumns { get; set; }

    public virtual DbSet<Link> Links { get; set; }

    public virtual DbSet<Lrow> Lrows { get; set; }

    public virtual DbSet<Page> Pages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("pk_accounts_id");

            entity.ToTable("accounts");

            entity.HasIndex(e => e.UserName, "uq_accounts_name").IsUnique();

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
            entity.Property(e => e.Settings).HasColumnName("settings");
            entity.Property(e => e.UserName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("userName");
        });

        modelBuilder.Entity<Lcolumn>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("pk_lcolumns_id");

            entity.ToTable("lcolumns");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Caption)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("caption");
            entity.Property(e => e.RowId).HasColumnName("rowId");

            entity.HasOne(d => d.Row).WithMany(p => p.Lcolumns)
                .HasForeignKey(d => d.RowId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_lcolumns_row_id");
        });

        modelBuilder.Entity<Link>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("pk_links_id");

            entity.ToTable("links");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AUrl)
                .IsUnicode(false)
                .HasColumnName("aUrl");
            entity.Property(e => e.Caption)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("caption");
            entity.Property(e => e.ColumnId).HasColumnName("columnId");

            entity.HasOne(d => d.Column).WithMany(p => p.Links)
                .HasForeignKey(d => d.ColumnId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_links_column_id");
        });

        modelBuilder.Entity<Lrow>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("pk_lrows_id");

            entity.ToTable("lrows");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Caption)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("caption");
            entity.Property(e => e.PageId).HasColumnName("pageId");

            entity.HasOne(d => d.Page).WithMany(p => p.Lrows)
                .HasForeignKey(d => d.PageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_lrows_page_id");
        });

        modelBuilder.Entity<Page>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("pk_pages_id");

            entity.ToTable("pages");

            entity.HasIndex(e => new { e.AccountId, e.PagePath }, "uq_page_path").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AccountId).HasColumnName("accountId");
            entity.Property(e => e.Caption)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("caption");
            entity.Property(e => e.PagePath)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("pagePath");

            entity.HasOne(d => d.Account).WithMany(p => p.Pages)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_pages_account_id");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
