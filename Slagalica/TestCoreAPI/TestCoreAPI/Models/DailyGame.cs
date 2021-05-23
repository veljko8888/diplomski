using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.Models
{
    public class DailyGame
    {
        [Key]
        public Guid Id { get; set; }
        public DateTime DailyGameDate { get; set; }
        public Guid ConnectionId { get; set; }
        public virtual Connection Connection { get; set; }
        public Guid AssociationId { get; set; }
        public virtual Association Association { get; set; }
    }
}
