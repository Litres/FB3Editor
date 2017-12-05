/**
 * Контроллер кнопки элемента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.view.toolbar.button.ButtonController',
	{
		extend: 'Ext.app.ViewController',

		alias: 'controller.editor.toolbar.button',

		onClick: function (button, e)
		{
			var me = this,
				btn = me.getView(),
				manager = btn.getEditorManager();

			if (e)
			{
				e.stopPropagation();
			}
			
			manager.createElement(btn.elementName, btn.createOpts);
		},

		/**
		 * Синхронизирует состояние кнопки с текущим выделением.
		 */
		onSync: function ()
		{
			var me = this,
				btn = me.getView();

			if (!btn.isActiveSelection())
			{
				me.verifyResult(false);
				//btn.disable();
			}
			else
			{
				me.verifyResult(true);
				//btn.enable();
			}
		},

		/**
		 * Проверяет получаемую схему.
		 * @param {String} xml Строка xml, новой проверяемой структуры.
		 * @param {Boolean} [debug] Нужно ли выводить отладочные сообщения.
		 */
		verify: function (xml, debug)
		{
			var me = this,
				btn = me.getView(),
				manager = btn.getEditorManager(),
				sch = manager.getSchema(),
				scopeData = {};

			scopeData.debug = debug;

			// вызываем проверку по схеме
			sch.validXml({xml: xml, callback: me.verifyResult, scope: me, scopeData: scopeData});
		},

		/**
		 * Возвращает xml контента без текстовых элементов для проверки по схеме.
		 * @return {String} Xml контента.
		 */
		getContentXml: function ()
		{
			var me = this,
				btn = me.getView(),
				manager = btn.getEditorManager(),
				content,
				xml;

			content = manager.getContent();
			xml = content.getXml(true, true);

			return xml;
		},

		/**
		 * @protected
		 * Получает результат проверки по схеме.
		 * @event afterVerifyResult
		 * @param {Boolean} enable Прошла ли проверка.
		 * @param {Object} [scopeData]
		 */
		verifyResult: function (enable, scopeData)
		{
			var me = this,
				btn = me.getView(),
				sequence;

			if (!btn)
			{
				// для скрытых кнопок
				return;
			}
			
			sequence = btn.getSequence();

			/*if (btn.elementName === 'table')
			{
				console.log(enable);
			}*/
			
			if (enable)
			{
				btn.enable();
			}
			else
			{
				btn.disable();
			}

			if (sequence)
			{
				// синхронизируем однотипные кнопки
				Ext.Array.each(
					sequence,
					function (seqBtn)
					{
						if (enable)
						{
							seqBtn.enable();
						}
						else
						{
							seqBtn.disable();
						}
					}
				);
			}

			//console.log('verifyResult', btn, me);

			btn.fireEvent('afterVerifyResult', btn, enable);
		}
	}
);