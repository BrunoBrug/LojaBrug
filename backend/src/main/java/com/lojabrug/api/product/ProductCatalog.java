package com.lojabrug.api.product;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Component;

@Component
public class ProductCatalog {
    private final List<Product> products = List.of(
        new Product(
            "camiseta-essencial",
            "Camiseta Essencial",
            "Camiseta",
            "Algodao macio com corte limpo.",
            8900,
            "/products/camiseta-essencial.jpg",
            List.of("P", "M", "G")
        ),
        new Product(
            "camiseta-noite",
            "Camiseta Noite",
            "Camiseta",
            "Preta, simples e marcante.",
            9900,
            "/products/camiseta-noite.jpg",
            List.of("P", "M", "G")
        ),
        new Product(
            "pulseira-linha",
            "Pulseira Linha",
            "Pulseira",
            "Metal discreto com presenca.",
            4900,
            "/products/pulseira-linha.jpg",
            List.of()
        ),
        new Product(
            "pulseira-cobre",
            "Pulseira Cobre",
            "Pulseira",
            "Tom quente para contraste sutil.",
            5400,
            "/products/pulseira-cobre.jpg",
            List.of()
        ),
        new Product(
            "bottom-assinatura",
            "Bottom Assinatura",
            "Bottom",
            "Detalhe grafico para a peca favorita.",
            1900,
            "/products/bottom-assinatura.jpg",
            List.of()
        ),
        new Product(
            "bottom-brilho",
            "Bottom Brilho",
            "Bottom",
            "Pequeno ponto de luz no look.",
            2200,
            "/products/bottom-brilho.jpg",
            List.of()
        )
    );

    public List<Product> findAll() {
        return products;
    }

    public Optional<Product> findById(String id) {
        return products.stream().filter(product -> product.id().equals(id)).findFirst();
    }
}
