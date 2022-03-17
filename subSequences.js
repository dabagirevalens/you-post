function isValidSubsequence(array, sequence) {
    /*
      By getting two non-empty integer arrays, for example [1, 2, 3, 4]
      A second array [1, 3,4] can be said to be a subsequence of the first one because it contains all the element
      present in the first one in the same order those appear in the first one, even though they are not adjacent.
      
      The algorithm below works by comparing the two array, looping through the first one once and then checking for
      each value if it is equal to the element in the subsequence array, once a match is found, it's on to the next 
      element in the subsequence. Note that if no match is found, the length of the subsequence array will never be same
      as the value of variable "Seq"

    */
    let seq = 0;

    for (const value of array) {
        if (sequence[seq] === value) {
            seq++
        }
    }

    return seq === sequence.length;
}

//sample tests

console.log(isValidSubsequence([1, 2, 3, 4], [1, 3, 4])); //true
console.log(isValidSubsequence([1, 2, 3, 4], [3, 2, 4])); //false

//more ...
console.log(isValidSubsequence([5, 1, 22, 25, 6, -1, 8, 10], [1, 6, -1, 10])); //true
console.log(isValidSubsequence([1, 1, 1, 1, 1], [1, 1, 1])); //true