package com.lojabrug.api.product;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Component;

@Component
public class ProductCatalog {
    private static final String IMAGE_BASE =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 1000'%3E%3Crect width='800' height='1000' fill='%23d9ded2'/%3E%3Ccircle cx='400' cy='460' r='170' fill='%230f6f6b' opacity='.18'/%3E%3Cpath d='M230 690h340' stroke='%23181713' stroke-width='18' stroke-linecap='round' opacity='.45'/%3E%3C/svg%3E";

    private final List<Product> products = List.of(
        new Product(
            "camiseta-essencial",
            "Camiseta Essencial",
            "Camiseta",
            "Algodao macio com corte limpo.",
            8900,
            IMAGE_BASE,
            List.of("P", "M", "G")
        ),
        new Product(
            "camiseta-noite",
            "Camiseta Noite",
            "Camiseta",
            "Preta, simples e marcante.",
            9900,
            IMAGE_BASE,
            List.of("P", "M", "G")
        ),
        new Product(
            "pulseira-linha",
            "Pulseira Linha",
            "Pulseira",
            "Metal discreto com presenca.",
            4900,
            IMAGE_BASE,
            List.of()
        ),
        new Product(
            "pulseira-cobre",
            "Pulseira Cobre",
            "Pulseira",
            "Tom quente para contraste sutil.",
            5400,
            IMAGE_BASE,
            List.of()
        ),
        new Product(
            "bottom-assinatura",
            "Bottom Assinatura",
            "Bottom",
            "Detalhe grafico para a peca favorita.",
            1900,
            IMAGE_BASE,
            List.of()
        ),
        new Product(
            "bottom-brilho",
            "Bottom Brilho",
            "Bottom",
            "Pequeno ponto de luz no look.",
            2200,
            IMAGE_BASE,
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
