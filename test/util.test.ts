import { expect } from 'chai';

import { getPluralS } from '../src/util';

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
	})
})