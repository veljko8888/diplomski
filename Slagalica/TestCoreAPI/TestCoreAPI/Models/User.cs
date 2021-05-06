using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }

        [Column(TypeName = "nvarchar(150)")]
        public string FullName { get; set; }

        [Column(TypeName = "nvarchar(150)")]
        public string Username { get; set; }

        [Column(TypeName = "nvarchar(150)")]
        public string Email { get; set; }

        [Column(TypeName = "nvarchar(350)")]
        public byte[] PasswordHash { get; set; }

        [Column(TypeName = "nvarchar(350)")]
        public byte[] PasswordSalt { get; set; }

        public string PhoneNumber { get; set; }

        public bool IsAccountActivated { get; set; }
    }
}
