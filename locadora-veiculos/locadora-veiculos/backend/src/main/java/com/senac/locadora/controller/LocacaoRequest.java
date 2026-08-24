package com.senac.locadora.controller;

import java.time.LocalDate;

public class LocacaoRequest {
    public Long veiculoId;
    public Long clienteId;
    public Long seguroId;
    public LocalDate dataInicio;
    public LocalDate dataFimPrevista;
}
