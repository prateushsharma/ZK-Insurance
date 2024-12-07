// This obviously doesn't need to be a separate file, but it's here to
// demonstrate that you can split up your summon code like this.
// import find_matching_insurer from './insurance.ts';

export default function main(
  a: PersonHealthProfile,
  b: [InsurancePolicyProfile],
): InsurancePolicyProfile[] {
  let matched_insurers: InsurancePolicyProfile[] = [];

  for (let i = 0; i < b.length; i++) {
    if (find_matching_insurer(a, b[i])) {
      matched_insurers.push(b[i]);
    }
  }

  return matched_insurers;
}

function find_matching_insurer(
  a: PersonHealthProfile,
  b: InsurancePolicyProfile,
): boolean {
  if (a.age < b.age.min || a.age > b.age.max) {
    return false;
  } else if (a.height < b.height.min || a.height > b.height.max) {
    return false;
  } else if (a.weight < b.weight.min || a.weight > b.weight.max) {
    return false;
  } else if (!b.bloodGroup.includes(a.bloodGroup)) {
    return false;
  } else if (!b.gender.includes(a.gender)) {
    return false;
  } else {
    return true;
  }
}

interface InsurancePolicyProfile {
  age: {
    min: number;
    max: number;
  };
  height: {
    min: number;
    max: number;
  };
  weight: {
    min: number;
    max: number;
  };
  gender: [string];
  bloodGroup: [string];
  // bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  // medicalConditions: [string];
}

interface PersonHealthProfile {
  age: number;
  height: number;
  weight: number;
  gender: string;
  bloodGroup: string;
  // medicalConditions: [string];
  // bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  // exercise: {
  //   frequency: "daily" | "weekly" | "monthly" | "rarely";
  //   duration: number; // in minutes
  // };
}
