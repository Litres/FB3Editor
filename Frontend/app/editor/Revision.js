/**
 * Управляет ревизиями xml.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.Revision',
	{
		/**
		 * @private
		 * @property {Number} Номер ривизии.
		 */
		rev: null,

		/**
		 * @private
		 * @property {String} Xml текста.
		 */
		xml: null,

		/**
		 * @private
		 * @property {FBEditor.editor.Manager} Менеджер редактора текста.
		 */
		manager: null,

		/**
		 * @private
		 * @property {FBEditor.util.Diff} Утилита для работы с диффами.
		 */
		diff: null,

		constructor: function (manager)
		{
			var me = this;

			me.manager = manager;
			me.diff = FBEditor.util.Diff.getInstance();
		},

		/**
		 * Возвращает xml.
		 * @return {String}
		 */
		getXml: function ()
		{
			return this.xml;
		},

		/**
		 * Возвращает номер ревизии.
		 * @return {Number}
		 */
		getRev: function ()
		{
			return this.rev;
		},

		/**
		 * Возвращает дифф для текущей ревизии.
		 * @return {String} Дифф.
		 */
		getDiff: function ()
		{
			var me = this,
				diff = me.diff,
				manager = me.manager,
				content = manager.getContent(),
				diffString,
				fileName, 
				oldStr, 
				newStr, 
				oldHeader, 
				newHeader,
				timeStart = new Date().getTime();
			
			fileName = '/fb3/body.xml';
			oldStr = me.getXml();
			newStr = content.getXml();
			newStr = '<?xml version="1.0" encoding="UTF-8"?>' + newStr;

			if (oldStr === newStr)
			{
				return false;
			}
			
			oldHeader = me.getRev();
			newHeader = Number(oldHeader) + 1;

			// получаем дифф
			diffString = diff.getDiff(fileName, oldStr, newStr, oldHeader, newHeader);

			console.log('getDiff', new Date().getTime() - timeStart);
			//console.log(diffString);

			return diffString;
		},

		/**
		 * Сохраняет ревизию.
		 * @param {Number} rev Номер ривизии.
		 * @param {String} [xml] Строка xml.
		 */
		setRev: function (rev, xml)
		{
			var me = this,
				manager = me.manager,
				content;

			content = manager.getContent();
			xml = xml ? xml.replace(/<!-- rev \d+ -->$/m, '') : null;
			me.xml = xml || '<?xml version="1.0" encoding="UTF-8"?>' + content.getXml();
			me.rev = rev;
		},

		/**
		 * Применяет дифф к тексту.
		 * @param {String} diffString Дифф.
		 * @return {Boolean} Успешно ли применен дифф.
		 */
		applyDiff: function (diffString)
		{
			var me = this,
				diff = me.diff,
				manager = me.manager,
				content = me.xml,
				newContent,
				result = false,
				timeStart = new Date().getTime();

			if (diffString)
			{
				// применяем дифф
				newContent = diff.applyDiff(content, diffString);

				console.log('applyDiff', new Date().getTime() - timeStart, diffString);

				if (newContent)
				{
					// создаем новый контент
					manager.createContent(newContent);

					result = true;
				}
			}

			return result;
		}
	}
);