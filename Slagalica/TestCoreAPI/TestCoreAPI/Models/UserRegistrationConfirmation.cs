using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.Models
{
    public class UserRegistrationConfirmation
    {
        [Key]
        [ForeignKey("User")]
        public Guid UserId { get; set; }
        public virtual User User { get; set; }

        [Column(TypeName = "nvarchar(150)")]
        public Guid Token { get; set; }
        public DateTime TokenExpirationTime { get; set; }
    }
}
