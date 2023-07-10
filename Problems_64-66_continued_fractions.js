// the continued fraction expansion of sqrt(d), for d a non-square positive integer, is written [a0; a1, a2, ..., an],
// where sqrt(d) = a0 + 1/(a1 + 1/(a2 + 1/(a3 + ... + 1/(an + 1/(a1 + 1/(a2 + ...))))).
// for all non-square positive integers d, this expansion is periodic, with period n.

// Problem 64: how many continued fraction expansions for d <= 10000 (in general d <= n), have odd period?

// returns greatest common denominator of two integers, a and b.
const gcd = (a,b) => {
    if (b === 0){
        return a;
    }
    return gcd(b, a%b);
}

// takes in number x in form x = (a + b*sqrt(d)) / c, 
// returns continued fraction expansion of x in form [a0, a1, a2, a3 ,..., an].
// assumes d is a non-square positive integer and x>0.
const continuedFractionFirstStep = (a,b,c,d) => {
    let x = (a + b*d**0.5) / c;
    const cont_frac = [];
    cont_frac.push(Math.floor(x));
    [a,b,c] = [(c**2)*Math.floor(x) -c*a, b*c, d*b**2 - (a - c*Math.floor(x))**2];
    // let a1 = (c**2)*Math.floor(x) -c*a;
    // let b1 = b*c;
    // let c1 = d*b**2 - (a - c*Math.floor(x))**2;
    x = (a + b*d**0.5) / c;
    const x0 = x;
    cont_frac.push(Math.floor(x));
    [a,b,c] = [(c**2)*Math.floor(x) -c*a, b*c, d*b**2 - (a - c*Math.floor(x))**2];
    x = (a + b*d**0.5) / c;
    while (x != x0){
        cont_frac.push(Math.floor(x));
        [a,b,c] = [(c**2)*Math.floor(x) -c*a, b*c, d*b**2 - (a - c*Math.floor(x))**2];
        let divisor = gcd(a, gcd(b,c));
        [a,b,c] = [a/divisor, b/divisor, c/divisor];
        x = (a + b*d**0.5) / c;
    }
    return cont_frac;
}


// returns continued fraction expansion of sqrt(d);
const continuedFractionSqrt = (d) =>{
    return continuedFractionFirstStep(0,1,1,d);
}


// returns array of positive integers <= n that are non-square
const nonSquares = (n) =>{
    const nonSquaresList = [];
    for (i = 1; i <= n; i++){
        if (i ** 0.5 % 1 != 0){
            nonSquaresList.push(i);
        }
    }
    return nonSquaresList;
}


// returns number of continued fractions expansions <= n with odd period
const problem64 = (n) => {
    let oddPeriods = 0;
    const nonSquaresList = nonSquares(n);
    for (i of nonSquaresList){
        const continuedFraction = continuedFractionSqrt(i);
        if ((continuedFraction.length-1) % 2 != 0){
            oddPeriods += 1;
        }
    }
    return oddPeriods;
}

// console.log(problem64(10000));


// Problem 65: convergents of e
// e has continued fraction expansion [2;1,2,1,1,4,1,1,6,1,1,8,1,...,1,2k,1,...]
// Find the sum of digits in the numerator of the 100th (in general nth) convergent of the 
// continued fraction for e


// gives the numerator and denominator of the nth convergent of the 
// continued fraction continuedFraction
const nthConvergent = (n, continuedFraction) => {
    let period = [...continuedFraction];
    period.shift();
    while (continuedFraction.length < n){
        continuedFraction = continuedFraction.concat(period);
    }
    let p0 = BigInt(continuedFraction[0]);
    let q0 = BigInt(1);
    let p1 = BigInt(continuedFraction[0]*continuedFraction[1] + 1);
    let q1 = BigInt(continuedFraction[1]);
    if (n === 0){
        return [p0,q0];
    }
    for (i=2; i<n; i++){
        let p = BigInt(BigInt(continuedFraction[i]) * p1 + p0);
        let q = BigInt(BigInt(continuedFraction[i]) * q1 + q0);
        [p0, p1] = [p1, p];
        [q0, q1] = [q1,q];
    }
    return [p1, q1];
}

const Problem65 = (n) => {
    let cont_frac = [2, 1, 2];
    for (i = 2; i <= Math.floor(n/3); i++){
        cont_frac.push(1, 1, 2*i);
    }
    if (n%3 === 1){
        cont_frac.push(1);
    }
    else if(n%3 === 2){
        cont_frac.push(1, 1);
    }
    const convergent = nthConvergent(n, cont_frac);
    return digitSumBigInt(convergent[0]);
}

const digitSumBigInt = (n) => {
    let sum = 0;
    const digitList = n.toString().split("");
    for (i of digitList){
        sum += parseInt(i);
    }
    return sum;
}

const digitSum2 = (n) => {
    let sum = 0;
    while(n > 0){
        sum += n % 10;
        n = (n - n%10)/10;
    }
    return sum;
}


const nthConvergentSqrt = (n,d) => {
    return nthConvergent(n, continuedFractionSqrt(d));
}

console.log("Problem 65:", Problem65(100));



// Problem 66: Diophantine equation

// Consider quadratic Diophantine equations of the form:
// x**2 – Dy**2 = 1
// For example, when D=13, the minimal solution in x is 649**2 – 13×180**2 = 1.
// It can be assumed that there are no solutions in positive integers when 
// D is square.
// Find the value of D ≤ 1000 (n) in minimal solutions of x for which the 
// largest value of x is obtained.


// returns the fundamental unit of sqrt(d)
const fundamentalUnit = (d) =>{
    const contFrac = continuedFractionSqrt(d);
    const periodLength = contFrac.length - 1;
    if (periodLength % 2 === 0){
        return nthConvergent(periodLength - 1, contFrac);
    }
    else {
        return nthConvergent(2*periodLength - 1, contFrac);
    }
}

