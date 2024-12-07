// This obviously doesn't need to be a separate file, but it's here to
// demonstrate that you can split up your summon code like this.
// import find_matching_insurer from './insurance.ts';

export default function main(a: PersonHealthProfile, b: [InsurancePolicyProfile]): InsurancePolicyProfile {
  // return find_matching_insurer(a, b) ? a : b;
  find_matching_insurer(a, b); 

  return b[0]
}
function find_matching_insurer(a: PersonHealthProfile, b: [InsurancePolicyProfile]): boolean {
  return false;
}


interface InsurancePolicyProfile {
  age: {
    min: number;
    max: number;
  };
  gender: "male" | "female" | "other";
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  exercise: {
    frequency: "daily" | "weekly" | "monthly" | "rarely";
    duration: number; // in minutes
  };
  medicalConditions: [string];
}

interface PersonHealthProfile {
  age: number;
  gender: "male" | "female" | "other";
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  exercise: {
    frequency: "daily" | "weekly" | "monthly" | "rarely";
    duration: number; // in minutes
  };
  medicalConditions: [string];
}
