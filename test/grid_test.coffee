{insert, layout} = require 'lib/grid'

describe 'Grid', ->
	last = (arr) -> arr[arr.length - 1]

	startItem = [[0,0,0,0]]

	describe 'grid 2 * 3', ->
		grid = [240*3, 240*2]
		el = [240, 240]

		it '#insert', ->
			items = startItem
			insPos = insert(items, grid, el)
			expect(insPos).deep.equal([0,0])

			items = [[0,0,240,240]]
			insPos = insert(items, grid, el)
			expect(insPos).deep.equal([240, 0])

			items = [[240,0,240,240]]
			insPos = insert(items, grid, el)
			expect(insPos).deep.equal([0, 240])

			items = [[0,240,240,240]]
			insPos = insert(items, grid, el)
			expect(insPos).deep.equal([240, 240])

			items = [[240,240,240,240]]
			insPos = insert(items, grid, el)
			expect(insPos).deep.equal([0, 240*2])

		it '#layout', ->
			items = [
				[0  ,0,240,240]
				[240,0,240,240]

				[0  ,240,240,240]
				[240,240,240,240]

				[0  ,240*2,240,240]
				[240,240*2,240,240]
			]

			result = [
				[0,0,0,0]
				[0    ,0,240,240]
				[240  ,0,240,240]
				[240*2,0,240,240]

				[0    ,240,240,240]
				[240  ,240,240,240]
			]

			grid = [240*2, 240*3]

			expect(layout(items, grid, startItem)).to.deep.equal(result)

	describe 'grid 3 * 4', ->
		grid = [240*4, 240*3]
		el = [240, 240]

		it '#insert', ->
			items = startItem
			insPos = insert(items, grid, el)
			expect(insPos).deep.equal([0,0])

			items = [[0,0,240,240]]
			insPos = insert(items, grid, el)
			expect(insPos).deep.equal([240, 0])

			items = [[240,0,240,240]]
			insPos = insert(items, grid, el)
			expect(insPos).deep.equal([240*2, 0])

			items = [[240*2,0,240,240]]
			insPos = insert(items, grid, el)
			expect(insPos).deep.equal([0, 240])

			items = [[0,240,240,240]]
			insPos = insert(items, grid, el)
			expect(insPos).deep.equal([240, 240])

		it '#layout', ->
			items = [
				[0     ,0,240,240]
				[240   ,0,240,240]
				[240*2 ,0,240,240]

				[0     ,240,240,240]
				[240*1 ,240,240,240]
				[240*2 ,240,240,240]

				[0     ,240*2,240,240]
				[240*1 ,240*2,240,240]
				[240*2 ,240*2,240,240]

				[0     ,240*3,240,240]
				[240*1 ,240*3,240,240]
				[240*2 ,240*3,240,240]
			]

			result = [
				[0,0,0,0]
				[0    ,0,240,240]
				[240  ,0,240,240]
				[240*2,0,240,240]
				[240*3,0,240,240]

				[0    ,240,240,240]
				[240  ,240,240,240]
				[240*2,240,240,240]
				[240*3,240,240,240]

				[0    ,240*2,240,240]
				[240  ,240*2,240,240]
				[240*2,240*2,240,240]
			]

			grid = [240*3, 240*4]

			expect(layout(items, grid, startItem)).to.deep.equal(result)
