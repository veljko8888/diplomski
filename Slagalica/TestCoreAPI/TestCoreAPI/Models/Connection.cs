using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.Models
{
    public class Connection
    {
        [Key]
        public Guid Id { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string Description { get; set; }

        public virtual ICollection<Pair> Pairs { get; set; }
    }
}
