import isLarger from './isLarger';

export default function main(a: number, b: number) {
  return isLarger(a, b) ? a : b;
}
