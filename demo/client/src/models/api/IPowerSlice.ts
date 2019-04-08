export interface IPowerSlice {
    /**
     * The start time of the slice.
     */
    startTime: number;

    /**
     * The end time of the slice.
     */
    endTime: number;

    /**
     * The output from the time slice.
     */
    value: number;
}
