import { APP_NOMBRE } from "@/src/constants/app";

const temas = {
  claro: {
    acento: "#A99985",
    advertenciaBorde: "#d8cfc4",
    advertenciaFondo: "#eee8df",
    advertenciaTexto: "#6b6258",
    backdrop: "rgba(37, 35, 35, 0.45)",
    bordeFuerte: "#a7aea7",
    bordeSuave: "#d8cfc4",
    error: "#B56B6B",
    exito: "#7A8F78",
    fondoApp: "#F5F1ED",
    fondoElevado: "#f9f6f2",
    fondoInverso: "#252323",
    primario: "#70798C",
    resalteCelda: "#DDE1E8",
    resalteGrupo: "#EEE8DF",
    secundario: "#A99985",
    superficie: "#E8E1D8",
    superficieOscura: "#dfd7cf",
    textoInvertido: "#FFFFFF",
    textoPrimario: "#252323",
    textoSecundario: "#4e4a46",
    textoSuave: "#70798C",
  },
  oscuro: {
    acento: "#B8A28E",
    advertenciaBorde: "#4a4038",
    advertenciaFondo: "#2b241f",
    advertenciaTexto: "#e5d7c7",
    backdrop: "rgba(10, 10, 10, 0.62)",
    bordeFuerte: "#574d45",
    bordeSuave: "#3b342f",
    error: "#D18A8A",
    exito: "#8FA88C",
    fondoApp: "#161311",
    fondoElevado: "#201b18",
    fondoInverso: "#F5F1ED",
    primario: "#8995A8",
    resalteCelda: "#313844",
    resalteGrupo: "#2a2520",
    secundario: "#A89380",
    superficie: "#2a2420",
    superficieOscura: "#37302b",
    textoInvertido: "#FFFFFF",
    textoPrimario: "#F5F0EA",
    textoSecundario: "#D6CCC0",
    textoSuave: "#9F978F",
  },
} as const;

export type BrandingModo = keyof typeof temas;
export type BrandingColores = (typeof temas)[BrandingModo];

let temaActivo: BrandingModo = "claro";

export function establecerTemaBranding(modo: BrandingModo) {
  temaActivo = modo;
}

interface BrandingConfig {
  app: {
    descripcionCorta: string;
    nombre: string;
  };
  colores: BrandingColores;
  layout: {
    anchoContenido: number;
    anchoTarjetaAuth: number;
    bordeGruesoSudoku: number;
    bordeSuaveSudoku: number;
    radioControl: number;
    radioPanel: number;
    radioTarjeta: number;
    tabBarAltura: number;
  };
  temas: typeof temas;
  tipografia: {
    cuerpo: string;
    cuerpoLigero: string;
    cuerpoMedio: string;
    cuerpoSemi: string;
    numeros: string;
    titulo: string;
    tituloFuerte: string;
    tituloMedio: string;
  };
}

export const branding: BrandingConfig = {
  app: {
    descripcionCorta: "Sudoku clasico con calma, foco y una estetica sobria.",
    nombre: APP_NOMBRE,
  },
  get colores() {
    return temas[temaActivo];
  },
  layout: {
    anchoContenido: 440,
    anchoTarjetaAuth: 430,
    bordeGruesoSudoku: 1.5,
    bordeSuaveSudoku: 0.6,
    radioControl: 16,
    radioPanel: 22,
    radioTarjeta: 24,
    tabBarAltura: 66,
  },
  temas,
  tipografia: {
    cuerpo: "Inter_400Regular",
    cuerpoLigero: "Inter_300Light",
    cuerpoMedio: "Inter_500Medium",
    cuerpoSemi: "Inter_600SemiBold",
    numeros: "Inter_300Light",
    titulo: "PlayfairDisplay_600SemiBold",
    tituloFuerte: "PlayfairDisplay_700Bold",
    tituloMedio: "PlayfairDisplay_500Medium",
  },
};
