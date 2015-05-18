/**
 * Таблица преобразований XSLT для схемы тела книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.xsl.SchemaBody',
	{
		singleton: true,

		/**
		 * Вовзращает xsl для преобразования xml в json.
		 * @return {String} Строка xsl
		 */
		getXsl: function ()
		{
			var xsl;

			xsl = '\
<?xml version="1.0" encoding="UTF-8"?>\
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">\
	<xsl:output encoding="UTF-8" indent="no" method="html"/>\
	<xsl:template match="/">\
		<xsl:call-template name="types"/>\
		elements = {\
		<xsl:for-each select=".//element">\
			<xsl:variable name="elementName" select="@name"/>\
			<xsl:if test="not(preceding::element[@name=$elementName]) and $elementName">\
				<xsl:if test="position()!=1">,</xsl:if>\
				\'<xsl:value-of select="$elementName"/>\': cse(\'<xsl:value-of select="$elementName"/>\', {\
				<xsl:call-template name="elements">\
					<xsl:with-param name="typeName" select="@type"/>\
					<xsl:with-param name="parentName" select="$elementName"/>\
				</xsl:call-template>\
				, attributes: {<xsl:if test="@*"><xsl:apply-templates select="@*"/></xsl:if>}\
				})\
			</xsl:if>\
		</xsl:for-each>};\
	</xsl:template>\
	\
	<xsl:template match="@*">\'<xsl:value-of select="local-name()"/>\': \'<xsl:value-of select="."/>\'<xsl:if test="position()!=last()">, </xsl:if></xsl:template>\
	\
	<xsl:template name="elements">\
		<xsl:param name="typeName"/>\
		<xsl:param name="parentName"/>\
		extend: \'<xsl:if test="$typeName">FBEditor.schema.body.</xsl:if><xsl:value-of select="substring-after($typeName, \'fb3b:\')"/><xsl:call-template name="extended"/>\'\
		<xsl:if test="count(.//element)">\
			, elements: {\
			<xsl:for-each select=".//element">\
				<xsl:variable name="elementName" select="@name"/>\
				<xsl:if test="not($elementName=\'note\' and $parentName=\'fb3-body\')">\
					<xsl:if test="position()!=1">,</xsl:if>\
					\'<xsl:value-of select="$elementName"/>\': {<xsl:if test="@*"><xsl:apply-templates select="@*"/></xsl:if>}\
				</xsl:if>\
			</xsl:for-each>\
			}\
		</xsl:if>\
	</xsl:template>\
	\
	<xsl:template name="extended">\
		<xsl:for-each select="descendant::extension">\
			<xsl:variable name="extendedName" select="@base"/>\
			<xsl:if test="position()=1">FBEditor.schema.body.<xsl:value-of select="substring-after($extendedName, \'fb3b:\')"/></xsl:if>\
		</xsl:for-each>\
	</xsl:template>\
	\
	<xsl:template name="types">\
		<xsl:for-each select="schema/complexType">\
			Ext.define(\'FBEditor.schema.body.<xsl:value-of select="@name"/>\', {});\
		</xsl:for-each>\
	</xsl:template>\
</xsl:stylesheet>\
			';

			return xsl;
		}
	}
);