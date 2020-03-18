import { assert, expect } from 'chai';

import { getMinFrom0Up, getPluralS, isDefinedString, isNeg1 } from '../src/util';

describe('UTILITY TESTS', () => {
	describe('Pluralization of words', ()=> {
		it('returns word that ends in \'s\' when count is zero', () => {
			const word: string = "cup";
			const count: number = 0;
			const suffix: string = getPluralS(count);
			expect(`${count} ${word}${suffix}`).equals("0 cups");
		})
	
		it('returns word that doesn\'t end in \'s\' when count is one', () => {
			const word: string = "cup";
			const count: number = 1;
			const suffix: string = getPluralS(count);
			expect(`${count} ${word}${suffix}`).equals("1 cup");
		})
	
		it('returns word that ends in \'s\' when count not one or zero', () => {
			const word: string = "cup";
			const count: number = 5;
			const suffix: string = getPluralS(count);
			expect(`${count} ${word}${suffix}`).equals("5 cups");
		})
	});

	describe('isDefinedString',()=>{
		it('returns false when variable is an empty string',()=>{
			const emptyString: string = "";
			expect(isDefinedString(emptyString)).equals(false);
		});

		it('returns true when variable has a non-empty, non-null value',()=>{
			const boy: string = "Harry";
			expect(isDefinedString(boy)).equals(true);
		})
	});

	describe('isNeg1',()=>{
		it('returns true when -1 argument is passed in',()=>{
			expect(isNeg1(-1)).equals(true);
		})

		it('returns false when 5 argument is passed in',()=>{
			expect(isNeg1(5)).equals(false);
		})
	});

	// getMinFrom0Up
	describe('getMinFrom0Up',()=>{
		describe('returns the lower of two numbers that are 0 or higher', () => {
			it('giving -1 back when (-1,-1) is passed in',()=>{
				expect(getMinFrom0Up(-1,-1)).equals(-1);
			})
			it('giving 7 back when (-1,7) is passed in',()=>{
				expect(getMinFrom0Up(-1,7)).equals(7);
			})
			it('giving 2 back when (2,-1) is passed in',()=>{
				expect(getMinFrom0Up(2,-1)).equals(2);
			})
			it('giving 3 back when (3,20) is passed in',()=>{
				expect(getMinFrom0Up(3,20)).equals(3);
			})
			it('throws an error when below range number is passed in',()=>{
				assert.throw(() => getMinFrom0Up(-5, 1), 
					Error, "Bad input error thrown");
			});
		})
	});
})