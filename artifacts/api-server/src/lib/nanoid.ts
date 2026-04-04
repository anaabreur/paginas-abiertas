const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateCode(length = 8): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}

export function getRank(points: number): string {
  if (points <= 150) return "Novata";
  if (points <= 400) return "Viajera";
  if (points <= 800) return "Aventurera";
  if (points <= 1500) return "Embajadora";
  return "Leyenda Literaria";
}
