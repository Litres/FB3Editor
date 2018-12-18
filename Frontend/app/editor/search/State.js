/**
 * Состояние поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.search.State',
	{
		config: {
			/**
			 * @cfg {String} Строка поиска.
			 */
			queryText: null,
			
			/**
			 * @cfg {RegExp} Регулярное выражение поиска.
			 */
			query: null,
			
			/**
			 * @cfg {Boolean} Регулярное ли выражение в строке поиска.
			 */
			isReg: null,
			
			/**
			 * @cfg {Boolean} Игнорировать ли регистр символов.
			 */
			ignoreCase: null,
			
			/**
			 * @cfg {Boolean} Искать ли слова.
			 */
			words: null,
			
			/**
			 * @cfg {FBEditor.editor.search.cursor.Cursor} Объект поиска.
			 */
			cursor: null,
			
			/**
			 * @cfg {Object} Подсветка в тексте.
			 */
			overlay: null,
			
			/**
			 * @cfg {Number} Количество найденных совпадений.
			 */
			count: null
		}
	}
);