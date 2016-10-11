/**
 * Утилита для работы с диффами.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.util.Diff',
	{		
		statics: {
			/**
			 * @private
			 * @property {FBEditor.util.Diff} Хранит синглтон.
			 */
			self: null,

			/**
			 * Возвращает синглтон.
			 * @return {FBEditor.util.Diff}
			 */
			getInstance: function ()
			{
				var me = this,
					self = FBEditor.util.Diff.self;
				
				self = self || Ext.create('FBEditor.util.Diff');
				FBEditor.util.Diff.self = self;
				
				return self;
			}
		},

		/**
		 * @private
		 * @property {Object} ссылка на внешнюю утилиту.
		 */
		diff: null,
		
		constructor: function ()
		{
			var me = this;
			
			// используем сторонюю утилиту в качестве основы
			me.diff = JsDiff;
		},

		getDiff: function (oldXml, newXml)
		{
			var me = this,
				diff = me.diff;

			return diff.diffChars(oldXml, newXml);
		}
	}
);