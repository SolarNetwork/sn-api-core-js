/**
 * API for a comparison between similar objects.
 * @public
 */
export default interface Comparable<T> {
    /**
     * Compare this instance to another.
     *
     * @param o - the object to compare to
     * @returns negative value, zero, or positive value if this instance is less than, equal to, or greater than `o`
     */
    compareTo(o: T | undefined): number;
}
//# sourceMappingURL=comparable.d.ts.map