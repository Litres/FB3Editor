/**
 * Абстрактный класс формы редактирования свойств элемента.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.AbstractEditor',
	{
		extend: 'Ext.form.Panel',
		requires: [
			'FBEditor.view.panel.main.props.body.editor.AbstractEditorController',
			'FBEditor.view.panel.main.props.body.editor.fields.id.Id'
		],

		controller: 'panel.props.body.editor',

		listeners: {
			change: 'onChange'
		},

		layout: 'anchor',
		width: '100%',

		defaults: {
			xtype: 'textfield',
			labelAlign: 'top',
			checkChangeBuffer: 200,
			listeners: {
				change: function ()
				{
					this.up('form').fireEvent('change');
				}
			}
		},

		/**
		 * @property {String} Имя элемента.
		 */
		elementName: null,

		/**
		 * @property {FBEditor.editor.element.AbstractElement} Ссылка на элемент.
		 */
		element: null,

		/**
		 * @property {Boolean} isLoad Первичная ли загрузка данных, после рендеринга формы.
		 * Если заргузка первичная, то нет необходимости реагировать на событие change полей формы.
		 */
		isLoad: false,

		/**
		 * @private
		 * @property {FBEditor.view.panel.main.props.body.Body} Панель свойств.
		 */
		panelProps: null,

		constructor: function (data)
		{
			var me = this;

			me.elementName = data.elementName;
			me.callParent(arguments);
		},

		/**
		 * Обновляет данные.
		 * @param {Object} data Данные.
		 * @param {Boolean} isLoad Первичная ли загрузка данных, после рендеринга формы.
		 * Если заргузка первичная, то нет необходимости реагировать на событие change полей формы.
		 */
		updateData: function (data, isLoad)
		{
			var me = this,
				form;

			form = me.getForm();
			me.isLoad = isLoad;
			me.element = data.el ? data.el : me.element;
			form.reset();
			form.setValues(data);
			me.isLoad = false;
		},

		/**
		 * Показывает/скрывает кнопки конвертирования и удаления.
		 * @param {Boolean} visible Показывать ли кнопки.
		 */
		setVisibleButtons: function (visible)
		{
			var me = this,
				panelProps,
				cnvBtn,
				delBtn;

			panelProps = me.getPanelProps();
			cnvBtn = panelProps.getConvertBtn();
			delBtn = panelProps.getDeleteBtn();
			cnvBtn.setVisible(visible);
			delBtn.setVisible(visible);
		},

		/**
		 * Возвращает панель свойств редактора текста.
		 * @return {FBEditor.view.panel.main.props.body.Body}
		 */
		getPanelProps: function ()
		{
			var me = this,
				panelProps;

			panelProps = me.panelProps || Ext.getCmp('panel-props-body');
			me.panelProps = panelProps;

			return panelProps
		}
	}
);