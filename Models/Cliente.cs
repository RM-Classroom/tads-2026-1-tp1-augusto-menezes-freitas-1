using System;
using System.Collections.Generic;

namespace LocadoraVeiculosTP1.Models
{
    public class Cliente
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Cpf { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        public virtual ICollection<Aluguel> Alugueis { get; set; } = new List<Aluguel>();
    }
}