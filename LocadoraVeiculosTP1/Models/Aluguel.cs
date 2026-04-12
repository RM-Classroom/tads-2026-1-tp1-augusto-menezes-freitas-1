using System;

namespace LocadoraVeiculosTP1.Models
{
    public class Aluguel
    {
        public int Id { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime DataDevolucao { get; set; }
        public decimal QuilometragemInicial { get; set; }
        public decimal QuilometragemFinal { get; set; }
        public decimal ValorDiaria { get; set; }
        public decimal ValorTotal { get; set; }

        // Chave Estrangeira do Cliente
        public int ClienteId { get; set; }
        public virtual Cliente? Cliente { get; set; }

        // Chave Estrangeira do Veiculo
        public int VeiculoId { get; set; }
        public virtual Veiculo? Veiculo { get; set; }
    }
}