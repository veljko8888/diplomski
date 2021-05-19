using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.Models
{
    public class Pair
    {
        [Key]
        public Guid Id { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string Left { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string Right { get; set; }

        public Guid ConnectionId { get; set; }
        public virtual Connection Connection { get; set; }
    }
}
