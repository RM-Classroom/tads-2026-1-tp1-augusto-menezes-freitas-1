namespace LocadoraVeiculosTP1.Models
{
    public class Veiculo
    {
        public int Id { get; set; }
        public string Modelo { get; set; } = string.Empty;
        public int AnoFabricacao { get; set; }
        public decimal Quilometragem { get; set; }

        // Chave Estrangeira do Fabricante
        public int FabricanteId { get; set; }
        public virtual Fabricante? Fabricante { get; set; }

        // Chave Estrangeira da Categoria
        public int CategoriaId { get; set; }
        public virtual Categoria? Categoria { get; set; }
    }
}