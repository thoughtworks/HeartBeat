export class Pair<K, V> {
  key: K;
  value: V;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }

  add(that: Pair<number, number>): Pair<number, number> {
    if (typeof this.key != "number" || typeof this.value != "number") {
      throw Error("time fetch error");
    }
    return new Pair<number, number>(
      this.key + that.key,
      this.value + that.value
    );
  }
}
