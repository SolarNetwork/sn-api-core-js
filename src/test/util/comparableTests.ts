import test from "ava";

import Comparable from "../../main/util/comparable.js";

class ComparableNumber extends Number implements Comparable<ComparableNumber> {
	compareTo(o: ComparableNumber): number {
		if (o === undefined) {
			return 1;
		}
		return this.valueOf() < o.valueOf()
			? -1
			: this.valueOf() > o.valueOf()
				? 1
				: 0;
	}
}

test("compare", (t) => {
	const n1 = new ComparableNumber(1);
	const n2 = new ComparableNumber(1);
	const n3 = new ComparableNumber(2);
	t.is(n1.compareTo(n1), 0, "comparison to self");
	t.is(n1.compareTo(n2), 0, "comparison to equal value");
	t.is(n1.compareTo(n3), -1, "comparison to greater value");
	t.is(n3.compareTo(n1), 1, "comparison to lesser value");
});
