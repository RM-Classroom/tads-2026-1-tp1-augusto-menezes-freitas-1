using System.Collections.Generic;

namespace LocadoraVeiculosTP1.Models
{
    public class Categoria
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public decimal ValorDiariaBase { get; set; }

        public virtual ICollection<Veiculo> Veiculos { get; set; } = new List<Veiculo>();
    }
}