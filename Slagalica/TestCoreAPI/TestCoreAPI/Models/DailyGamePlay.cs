using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.Models
{
    public class DailyGamePlay
    {
        [Key]
        public Guid Id { get; set; }
        public DateTime DailyGameDate { get; set; }
        public int Points { get; set; }
        public Guid UserId { get; set; }
        public virtual User Connection { get; set; }
    }
}
