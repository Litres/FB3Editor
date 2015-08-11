/**
 * Контроллер панели свойств редактора текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.BodyController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.props.body',

		onBeforeActivate: function ()
		{
			var me = this,
				view = me.getView(),
				editor,
				convertBtn,
				deleteBtn;

			// приводим панель редактирования к начальному состоянию

			Ext.getCmp('props-element-info').update();

			// кнопки
			convertBtn = view.down('button-editor-convert-element');
			deleteBtn = view.down('button-editor-delete-element');
			convertBtn.setVisible(false);
			deleteBtn.setVisible(false);
			editor = view.editor;
			if (editor)
			{
				// удаляем старую панель редактирования
				view.remove(editor);
				view.editor = null;
			}
		},

		onAfterRender: function ()
		{
			var me = this,
				bridge = FBEditor.getBridgeWindow(),
				focusEl,
				data;

			// если есть активный элемент в тексте, то показываем его данные
			focusEl = bridge.FBEditor.editor.Manager.getFocusElement();
			if (focusEl)
			{
				data = focusEl.getData();
				me.onLoadData(data);
			}
		},

		/**
		 * Показывает свойства элемента редактора текста.
		 * @param {Object} data Данные элемента.
		 */
		onLoadData: function (data)
		{
			var me = this,
				view = me.getView(),
				name,
				editor,
				convertBtn,
				deleteBtn,
				el;

			if (data)
			{
				//console.log(data);

				// обновляем инфу
				Ext.getCmp('props-element-info').update(data);

				el = data.el;

				// кнопки
				convertBtn = view.down('button-editor-convert-element');
				deleteBtn = view.down('button-editor-delete-element');
				convertBtn.element = el;
				deleteBtn.element = el;
				convertBtn.setVisible(true);
				deleteBtn.setVisible(true);
				if (el.isRoot)
				{
					deleteBtn.setVisible(false);
				}
				if (el.isImg || el.isRoot)
				{
					convertBtn.setVisible(false);
				}

				editor = view.editor;
				if (!editor || editor && editor.elementName !== data.elementName)
				{
					if (editor)
					{
						// удаляем старую панель редактирования
						view.remove(editor);
					}

					try
					{
						// добавляем новую панель редактирования
						name = 'FBEditor.view.panel.main.props.body.editor.' + data.elementName + '.Editor';
						editor = Ext.create(name, {elementName: data.elementName});
						view.add(editor);
					}
					catch (e)
					{
						editor = null;
					}
				}

				if (editor)
				{
					// обновляем даные панели редактирования
					editor.updateData(data, true);
				}
				view.editor = editor;
			}
		}
	}
);