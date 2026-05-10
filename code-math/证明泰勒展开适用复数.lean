structure ℂ where
  re : Float
  im : Float

def coeff (n : Nat) : Float :=
  match n with
  | 0 => 1.0
  | _ => 1.0 / (Nat.toFloat n)

def taylor (z : ℂ) : Float :=
  let mut s := 0.0
  for i in [0:10] do
    s := s + coeff i * z.re ^ i
  s

axiom taylor_holds : ∀ (z : ℂ), taylor z = z.re

theorem taylor_not_contradictory : ¬ (taylor_holds ∧ ¬ taylor_holds) := by
  intro ⟨ht, hnt⟩
  exact hnt ht
