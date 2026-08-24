package com.senac.locadora.controller;

import com.senac.locadora.model.Seguro;
import com.senac.locadora.repository.SeguroRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seguros")
public class SeguroController {

    private final SeguroRepository repository;

    public SeguroController(SeguroRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Seguro> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Seguro criar(@RequestBody Seguro seguro) {
        return repository.save(seguro);
    }
}
