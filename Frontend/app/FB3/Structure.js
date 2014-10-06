/**
 * Структура архива FB3.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.Structure',
	{
		/**
		 * @property {Object} Обязательные файлы в структуре.
		 */
		rels: {
			'[Content_Types].xml': 'FBEditor.FB3.ContentTypes',
			'_rels/.rels': 'FBEditor.FB3.Rels'
		},



		/**
		 * Создает структуру архива.
		 * @param {Object} files Файлы архива.
		 */
		constructor: function (files)
		{
			var me = this;

			if (!me.valid(files))
			{
				throw Error('Ошибка структуры архива');
			}
		},

		/**
		 * Проверяет валидность структуры файлов.
		 * @param {Object} files Файлы архива.
		 * @returns {Boolean} Валидна ли структура.
		 */
		valid: function (files)
		{
			var me = this,
				rels = me.rels,
				keysFiles = Ext.Object.getKeys(files),
				result = true;

			Ext.Msg.show(
				{
					title: 'Структура архива',
					message: keysFiles
				}
			);
			Ext.Object.each(
				rels,
			    function (key, val)
			    {
				    //console.log(key);
				    if (!Ext.Array.contains(keysFiles, key))
				    {
					    result = false;

					    return false;
				    }
			    }
			);


			return result;
		}
	}
);