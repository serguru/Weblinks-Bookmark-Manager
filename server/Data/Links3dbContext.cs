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

//    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
//        => optionsBuilder.UseSqlServer("Server=LAPTOP-UH69GVA4;Initial Catalog=links3db;Integrated Security=SSPI; MultipleActiveResultSets=true;TrustServerCertificate=True;");

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

            entity.HasOne(d => d.Account).WithMany(p => p.Pages)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__pages__accountId__4F7CD00D");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
