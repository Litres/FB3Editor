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
		rev: 0,

		/**
		 * @private
		 * @property {String} Xml текста.
		 */
		xml: null,

		/**
		 * @private
		 * @property {FBEditor.editor.Manager} Менеджер редактора текста
		 */
		manager: null,

		constructor: function (manager)
		{
			var me = this;

			me.manager = manager;
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
		 * Сохраняет ревизию.
		 * @param {Number} [rev] Номер ривизии. Если номер ревизии не был передан, то увеличится текущий номер на 1.
		 */
		setRev: function (rev)
		{
			var me = this,
				manager = me.manager,
				content;

			content = manager.getContent();
			me.xml = content.getXml();
			me.rev = rev || ++me.rev;
		}
	}
);