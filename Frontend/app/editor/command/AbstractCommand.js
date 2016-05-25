/**
 * Абстрактная команда редактора тела книги.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.AbstractCommand',
	{
		extend: 'FBEditor.command.InterfaceCommand',

		/**
		 * @property {Object} Данные для команды.
		 */
		data: null,

		/**
		 * @param {Object} opts Данные.
		 */
		constructor: function (opts)
		{
			var me = this;

			me.data = opts || {};
		},

		/**
		 * Возвращает данные для команды.
		 * @return {Object} Данные для команды.
		 */
		getData: function ()
		{
			return this.data;
		},

		/**
		 * Возвращает менеджер истории редактора текста.
		 * @param {FBEditor.editor.element.AbstractElement} el Эемент.
		 * @return {FBEditor.editor.History}
		 */
		getHistory: function (el)
		{
			var editor,
				history;

			editor = el.getEditor();
			history = editor.getHistory();

			return history;
		},

		/**
		 * Проверяет по схеме элемент.
		 * @param {FBEditor.editor.element.AbstractElement} el Элемент.
		 * @param {Boolean} [debug] Нужны ли отладочные сообщения.
		 */
		verifyElement: function (el, debug)
		{
			var me = this,
				manager = el.getManager(),
				sch = manager.getSchema(),
				scopeData,
				xml;

			if (!el || el.isText || el.isUndefined || el.isStyleHolder && el.isEmpty())
			{
				// текст, пустые абзацы и неопределенные элементы не нуждаются в проверке
				return true;
			}

			// получаем xml без текстовых элементов
			xml = manager.content.getXml(true);

			//console.log(xml, sch._xsd);

			scopeData = {
				el: el,
				debug: debug
			};

			// вызываем проверку по схеме
			sch.validXml({xml: xml, callback: me.verifyResult, scope: me, scopeData: scopeData});
		},

		/**
		 * @private
		 * Получает результат проверки элемента по схеме и в случае неудачи отменяет действие команды.
		 * @param {Boolean} res Успешна ли проверка.
		 * @param {Object} [scopeData]
		 */
		verifyResult: function (res, scopeData)
		{
			var me = this,
				el = scopeData.el,
				manager,
				xml;

			if (!res)
			{
				xml = el.getXml();

				// отменяем действие команды
				me.unExecute();

				Ext.log({msg: 'Полученная структура элемента не соответствует схеме:', dump: xml, level: 'info'});

				throw Error('Действие команды отменено для ' + el.getName());
			}

			manager = el.getManager();

			// принудительно синхронизируем кнопки, игнорируя кэш
			manager.syncButtons();
		}
	}
);