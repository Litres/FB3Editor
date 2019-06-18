/**
 * Кнотроллер корневого элемента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.root.RootElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',
		requires: [
			'FBEditor.editor.command.TextModifiedCommand'
		],

		/**
		 * Редактирование текстового узла.
		 * @param {Object} e Событие.
		 * @param {Node} e.target Редактируемый узел.
		 */
		onTextModified: function (e)
		{
			var me = this,
				target = e.target,
				parentNode,
				manager,
				cmd;

			manager = me.getElement().getManager();

			if (manager.isSuspendEvent())
			{
				return;
			}

			parentNode = target.parentNode;

			if (!parentNode.getElement)
			{
				Ext.defer(
					function ()
					{
						this.onTextModified({target: target});
					},
					1,
					me
				);

				return;
			}

			//console.log('DOMCharacterDataModified:', e, me);

			cmd = Ext.create('FBEditor.editor.command.TextModifiedCommand',
				{node: target, newValue: e.newValue, oldValue: e.prevValue});

			if (cmd.execute())
			{
				me.getHistory().add(cmd);
			}
		},

        /**
         * Отпускание кнопки мыши определяет элемент, на котором находится фокус.
         * @param {Event} e Объект события.
         */
        onMouseUp: function (e)
        {
            var me = this,
                nodes = {},
                els = {};

            nodes.target = e.target;
            els.target = nodes.target.getElement ? nodes.target.getElement() : null;
            
            if (!els.target.isRoot)
            {
                me.callParent(arguments);
            }
        },

		onFocus: function (e)
		{
			var me = this,
				els = {},
				nodes = {},
				relatedTarget = e.relatedTarget,
				sel = window.getSelection(),
				manager,
				helper,
				range,
				viewportId;

			els.root = me.getElement();
			manager = els.root.getManager();
			range = sel && sel.rangeCount ? sel.getRangeAt(0) : null;
			els.start = range && range.startContainer.getElement ? range.startContainer.getElement() : null;
			els.startRoot = els.start ? els.start.getRoot() : null;
			
			if (els.startRoot && els.startRoot.equal(els.root))
			{
				// восстановление фокуса не требуется
				me.callParent(arguments);
				return;
			}

			if (relatedTarget &&
			    (!relatedTarget.getElement || !relatedTarget.getElement().getRoot().equal(els.root)))
			{
				// если фокус пришел с другого компонента

				me.enableAllEditable();
				range = manager.getRange();

				if (range)
				{
					//console.log(range);
					// восстанавливаем позицию курсора
					manager.restoreCursor();
				}
				else
				{
					// ставим курсор в начало документа

					els.deepFirst = els.root.getDeepFirst();
					helper = els.deepFirst.getNodeHelper();
					viewportId = e.target.viewportId;
					nodes.deepFirst = helper.getNode(viewportId);

					manager.setCursor(
						{
							startNode: nodes.deepFirst
						}
					);

					// прокручиваем скролл в начало документа
					helper = els.root.getNodeHelper();
					nodes.root = helper.getNode(viewportId);
					nodes.root.scrollTop = 0;
				}
			}
		},

		/**
		 * Вставка из буфера обмена.
		 * @param {Object} e Событие.
		 * @param {clipboardData} e.clipboardData Объект буфера.
		 */
		onPaste: function (e)
		{
			var me = this,
				cmd;

			e.preventDefault();
			e.stopPropagation();
			
			cmd = Ext.create('FBEditor.editor.command.PasteCommand', {e: e});

			if (cmd.execute())
			{
				me.getHistory().add(cmd);
			}
		},

		/**
		 * Вырезание из текста.
		 * @param {Object} e Событие.
		 * @param {ClipboardData} e.clipboardData Объект буфера.
		 */
		onCut: function (e)
		{
			var me = this,
				focus = me.getFocusNode(e.target),
				el,
				cmd;

			//console.log(focus);

			if (focus.nodeName === 'IMG')
			{
				el = focus.getElement();
				el.fireEvent('cut', e);
			}
			else
			{
				e.preventDefault();
				e.stopPropagation();

				cmd = Ext.create('FBEditor.editor.command.CutCommand', {e: e});

				// выполняем команду без сохранения в истории, так как сама команда вызовет другую команду, которая как
				// раз и сохранится в истории
				cmd.execute();
			}
		},

        /**
         * Перед копированием.
         * @param {Event} e Объект события.
         */
        onBeforeCopy: function (e)
        {
            //console.log('navigator', navigator);
        },

        /**
         * Копирование.
         * @param {Event} e Объект события.
         */
        onCopy: function (e)
        {
            var me = this,
                el = me.getElement(),
				editorManager = el.getManager(),
                resourceManager = FBEditor.resource.Manager,
                clipboardData,
				rangeXml,
                text;

            //console.log('onCopy', e);

            e.preventDefault();

            // получаем xml выделенного фрагмента текста
            rangeXml = editorManager.getRangeXml();
            
            // меняем название элемента title в буфере, чтобы он корректно парсился при вставке в другую книгу
            rangeXml = rangeXml.replace(/<([/]?)title(.*?)>/ig, '<$1fb3-title$2>');
            
            //console.log(rangeXml);

            // получаем только текст, вырезая теги
            text = rangeXml.replace(/<(.*?)>/ig, '');

            // вставляем данные всех выделенных изображений в скопированный текст в виде base64
            rangeXml = resourceManager.convertImgToBase64(rangeXml);

            clipboardData = Ext.create('FBEditor.util.ClipboardData', e);

            // перезаписываем данные в буфер обмена
            clipboardData.setText(text);
            clipboardData.setHtml(rangeXml);

            e.preventDefault();
        },
		
		onContextMenu: function (e)
		{
			var me = this,
				manager,
				el;
			
			el = e.target.getElement ? e.target.getElement() : null;
			manager = el.getManager();
			manager.createContextMenu(el, e);
		}
	}
);