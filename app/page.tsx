"use client";

import { useState } from "react";

interface Item {
  nome: string;
  valorOrg: number;
  valorVenda: number;
  quantidade: number;
}

interface Venda {
  id: number;
  itens: { nome: string; quantidade: number; total: number; lucro: number; ganhoOrg: number }[];
  totalVendido: number;
  totalLucro: number;
  totalOrg: number;
  dataHora: string;
}

const itensBase: Omit<Item, "quantidade">[] = [
  { nome: "Kits", valorOrg: 150, valorVenda: 400 },
  { nome: "Nitro", valorOrg: 300, valorVenda: 1000 },
  { nome: "Full Kit Pack", valorOrg: 30000, valorVenda: 75000 },
  { nome: "Fumo", valorOrg: 300, valorVenda: 20000 },
  { nome: "Vidros", valorOrg: 180, valorVenda: 20000 },
  { nome: "Neons", valorOrg: 950, valorVenda: 20000 },
  { nome: "Xenons", valorOrg: 200, valorVenda: 20000 },
];

export default function OficinaApp() {
  const [itens, setItens] = useState<Item[]>(
    itensBase.map((item) => ({ ...item, quantidade: 0 }))
  );
  const [historico, setHistorico] = useState<Venda[]>([]);

  const atualizarQuantidade = (index: number, valor: string) => {
    const novaLista = [...itens];
    novaLista[index].quantidade = Math.max(0, Number(valor) || 0);
    setItens(novaLista);
  };

  const calcularTotalItem = (item: Item) => {
    return item.quantidade * item.valorVenda;
  };

  const calcularLucroItem = (item: Item) => {
    return item.quantidade * (item.valorVenda - item.valorOrg);
  };

  const calcularGanhoOrg = (item: Item) => {
    return item.quantidade * item.valorOrg;
  };

  const totalVendido = itens.reduce(
    (acc, item) => acc + calcularTotalItem(item),
    0
  );
  const totalLucro = itens.reduce(
    (acc, item) => acc + calcularLucroItem(item),
    0
  );
  const totalOrg = itens.reduce(
    (acc, item) => acc + calcularGanhoOrg(item),
    0
  );

  const registrarVenda = () => {
    if (totalVendido === 0) return;

    const itensVendidos = itens
      .filter((item) => item.quantidade > 0)
      .map((item) => ({
        nome: item.nome,
        quantidade: item.quantidade,
        total: calcularTotalItem(item),
        lucro: calcularLucroItem(item),
        ganhoOrg: calcularGanhoOrg(item),
      }));

    const novaVenda: Venda = {
      id: Date.now(),
      itens: itensVendidos,
      totalVendido,
      totalLucro,
      totalOrg,
      dataHora: new Date().toLocaleString("pt-PT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };

    setHistorico([novaVenda, ...historico]);
    setItens(itensBase.map((item) => ({ ...item, quantidade: 0 })));
  };

  const limparHistorico = () => {
    setHistorico([]);
  };

  return (
    <div 
      className="min-h-screen text-white p-4 md:p-8 relative"
      style={{
        backgroundImage: "url('/images/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/30" />
      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Oficina Red Car</h1>
        <p className="text-zinc-400 mb-6">
          Sistema de cálculo de vendas e lucros
        </p>

        {/* Resumo Total */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 md:p-6 mb-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-zinc-400 text-sm">Valor Final</p>
              <p className="text-green-400 font-bold text-2xl md:text-3xl">
                € {totalVendido.toLocaleString("pt-PT")}
              </p>
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Meu Lucro</p>
              <p className="text-emerald-400 font-bold text-xl md:text-2xl">
                € {totalLucro.toLocaleString("pt-PT")}
              </p>
            </div>
            <div className="md:text-right">
              <p className="text-zinc-400 text-sm">Ganho da ORG</p>
              <p className="text-amber-400 font-bold text-xl md:text-2xl">
                € {totalOrg.toLocaleString("pt-PT")}
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Itens */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 md:p-6 mb-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4">Itens</h2>
          <div className="space-y-3">
            {itens.map((item, index) => {
              const totalItem = calcularTotalItem(item);
              const lucroItem = calcularLucroItem(item);
              const ganhoOrgItem = calcularGanhoOrg(item);

              return (
                <div
                  key={item.nome}
                  className="bg-zinc-800/60 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-4"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{item.nome}</h3>
                    <p className="text-sm text-zinc-400">
                      Venda: €{item.valorVenda.toLocaleString("pt-PT")} | Org: €
                      {item.valorOrg.toLocaleString("pt-PT")}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={item.quantidade || ""}
                      onChange={(e) =>
                        atualizarQuantidade(index, e.target.value)
                      }
                      className="bg-zinc-700 rounded-lg px-3 py-2 w-20 outline-none focus:ring-2 focus:ring-green-500 transition-all text-center"
                      placeholder="0"
                      min="0"
                    />

                    <div className="text-right min-w-[120px]">
                      <p className="text-green-400 font-semibold">
                        € {totalItem.toLocaleString("pt-PT")}
                      </p>
                      <p className="text-xs text-emerald-500">
                        Lucro: € {lucroItem.toLocaleString("pt-PT")}
                      </p>
                      <p className="text-xs text-amber-500">
                        ORG: € {ganhoOrgItem.toLocaleString("pt-PT")}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botao Registar */}
          <button
            onClick={registrarVenda}
            disabled={totalVendido === 0}
            className="w-full mt-6 bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Registar Venda
          </button>
        </div>

        {/* Historico de Vendas */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 md:p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Historico de Vendas</h2>
            {historico.length > 0 && (
              <button
                onClick={limparHistorico}
                className="text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                Limpar tudo
              </button>
            )}
          </div>

          {historico.length === 0 ? (
            <p className="text-zinc-500 text-center py-8">
              Nenhuma venda registada ainda
            </p>
          ) : (
            <>
              <div className="space-y-3 max-h-[400px] overflow-y-auto mb-4">
                {historico.map((venda) => (
                  <div
                    key={venda.id}
                    className="bg-zinc-800/60 rounded-xl p-4 border border-zinc-700"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm text-zinc-400">{venda.dataHora}</p>
                      <div className="text-right">
                        <p className="text-green-400 font-semibold">
                          € {venda.totalVendido.toLocaleString("pt-PT")}
                        </p>
                        <p className="text-xs text-emerald-500">
                          Lucro: € {venda.totalLucro.toLocaleString("pt-PT")}
                        </p>
                        <p className="text-xs text-amber-500">
                          ORG: € {venda.totalOrg.toLocaleString("pt-PT")}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {venda.itens.map((item, i) => (
                        <span
                          key={i}
                          className="bg-zinc-700 text-zinc-300 text-xs px-2 py-1 rounded-lg"
                        >
                          {item.quantidade}x {item.nome}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total do Historico */}
              <div className="bg-zinc-700/60 border border-zinc-600 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-zinc-300 mb-3">Total de Todas as Vendas</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-zinc-400">Valor Final</p>
                    <p className="text-green-400 font-bold text-lg">
                      € {historico.reduce((acc, v) => acc + v.totalVendido, 0).toLocaleString("pt-PT")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Meu Lucro</p>
                    <p className="text-emerald-400 font-bold text-lg">
                      € {historico.reduce((acc, v) => acc + v.totalLucro, 0).toLocaleString("pt-PT")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-400">Ganho ORG</p>
                    <p className="text-amber-400 font-bold text-lg">
                      € {historico.reduce((acc, v) => acc + v.totalOrg, 0).toLocaleString("pt-PT")}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
