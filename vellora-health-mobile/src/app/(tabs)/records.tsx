import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { MEDICAL_RECORDS } from '../../data/mockData';
import { Badge } from '../../components/common/Badge';
import { Header } from '../../components/common/Header';
import { Ionicons } from '@expo/vector-icons';

export default function RecordsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'LAB' | 'RX'>('ALL');
  const labReport = MEDICAL_RECORDS[0];
  const prescription = MEDICAL_RECORDS[1];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Medical Records & EMR" subtitle="Verified Clinical Reports" showBack={false} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Filter Pills */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            onPress={() => setSelectedFilter('ALL')}
            style={[styles.filterPill, selectedFilter === 'ALL' && styles.filterPillActive]}
          >
            <Text style={[styles.filterText, selectedFilter === 'ALL' && styles.filterTextActive]}>
              All Records
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedFilter('LAB')}
            style={[styles.filterPill, selectedFilter === 'LAB' && styles.filterPillActive]}
          >
            <Text style={[styles.filterText, selectedFilter === 'LAB' && styles.filterTextActive]}>
              Diagnostic Labs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedFilter('RX')}
            style={[styles.filterPill, selectedFilter === 'RX' && styles.filterPillActive]}
          >
            <Text style={[styles.filterText, selectedFilter === 'RX' && styles.filterTextActive]}>
              e-Prescriptions
            </Text>
          </TouchableOpacity>
        </View>

        {/* 1. Diagnostic Lab Report Card (CBC with Differential) */}
        {(selectedFilter === 'ALL' || selectedFilter === 'LAB') && (
          <View style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <View style={styles.reportHeaderLeft}>
                <Badge label="LAB REPORT • VERIFIED" variant="emerald" size="sm" iconName="checkmark-done" />
                <Text style={styles.reportTitle}>{labReport.serviceTitle}</Text>
                <Text style={styles.reportMeta}>
                  {labReport.clinicianName} • {labReport.date}
                </Text>
              </View>
              <TouchableOpacity activeOpacity={0.8} style={styles.downloadPill}>
                <Ionicons name="download-outline" size={16} color={Colors.forest} />
              </TouchableOpacity>
            </View>

            {/* Vitals Baseline */}
            <Text style={styles.subHeading}>Bedside Patient Vitals</Text>
            <View style={styles.vitalsGrid}>
              <View style={styles.vitalBox}>
                <Text style={styles.vitalLabel}>Blood Pressure</Text>
                <Text style={styles.vitalValue}>{labReport.vitals?.bloodPressure}</Text>
              </View>
              <View style={styles.vitalBox}>
                <Text style={styles.vitalLabel}>Heart Rate</Text>
                <Text style={styles.vitalValue}>{labReport.vitals?.heartRate}</Text>
              </View>
              <View style={styles.vitalBox}>
                <Text style={styles.vitalLabel}>Blood Oxygen</Text>
                <Text style={styles.vitalValue}>{labReport.vitals?.oxygenSaturation}</Text>
              </View>
              <View style={styles.vitalBox}>
                <Text style={styles.vitalLabel}>Fasting Glucose</Text>
                <Text style={styles.vitalValue}>{labReport.vitals?.bloodGlucose}</Text>
              </View>
            </View>

            {/* Lab Parameters Table */}
            <Text style={styles.subHeading}>Hematology & Biochemistry Parameters</Text>
            <View style={styles.labTable}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeadCol, { flex: 2 }]}>Parameter</Text>
                <Text style={[styles.tableHeadCol, { flex: 1.2 }]}>Result</Text>
                <Text style={[styles.tableHeadCol, { flex: 1.5 }]}>Ref Range</Text>
                <Text style={[styles.tableHeadCol, { flex: 1, textAlign: 'right' }]}>Flag</Text>
              </View>

              {labReport.labResults?.map((item, idx) => (
                <View key={idx} style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]}>
                  <Text style={[styles.colParam, { flex: 2 }]}>{item.parameter}</Text>
                  <Text style={[styles.colResult, { flex: 1.2 }]}>
                    {item.result} <Text style={styles.colUnit}>{item.unit}</Text>
                  </Text>
                  <Text style={[styles.colRange, { flex: 1.5 }]}>{item.referenceRange}</Text>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Badge
                      label={item.status}
                      variant={item.status === 'NORMAL' ? 'emerald' : 'amber'}
                      size="sm"
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 2. Doctor Bedside e-Prescription */}
        {(selectedFilter === 'ALL' || selectedFilter === 'RX') && (
          <View style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <View style={styles.reportHeaderLeft}>
                <Badge label="DIGITAL e-Rx" variant="teal" size="sm" iconName="medkit" />
                <Text style={styles.reportTitle}>{prescription.serviceTitle}</Text>
                <Text style={styles.reportMeta}>
                  {prescription.clinicianName} • {prescription.date}
                </Text>
              </View>
              <TouchableOpacity activeOpacity={0.8} style={styles.downloadPill}>
                <Ionicons name="print-outline" size={16} color={Colors.forest} />
              </TouchableOpacity>
            </View>

            <Text style={styles.rxSummary}>{prescription.summary}</Text>

            <Text style={styles.subHeading}>Prescribed Medications</Text>
            {prescription.medications?.map((med, idx) => (
              <View key={idx} style={styles.medCard}>
                <View style={styles.medIconBox}>
                  <Ionicons name="medical" size={16} color={Colors.forest} />
                </View>
                <View style={styles.medInfo}>
                  <Text style={styles.medName}>{med.name}</Text>
                  <Text style={styles.medDosage}>
                    {med.dosage} • {med.frequency}
                  </Text>
                  <Text style={styles.medDuration}>Duration: {med.duration}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxxl,
    backgroundColor: Colors.mist,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  filterPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.line,
  },
  filterPillActive: {
    backgroundColor: Colors.forest,
    borderColor: Colors.forest,
  },
  filterText: {
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    fontSize: Typography.fontSize.xs,
    color: Colors.inkSoft,
  },
  filterTextActive: {
    color: Colors.white,
  },
  reportCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.line,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
    paddingBottom: Spacing.sm,
  },
  reportHeaderLeft: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  reportTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.base,
    color: Colors.ink,
    marginTop: 4,
  },
  reportMeta: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.muted,
  },
  downloadPill: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subHeading: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.xs,
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
    marginTop: Spacing.xs,
  },
  vitalsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    gap: 6,
  },
  vitalBox: {
    flex: 1,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.sm,
    padding: Spacing.xs,
    alignItems: 'center',
  },
  vitalLabel: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 9,
    color: Colors.muted,
    marginBottom: 2,
    textAlign: 'center',
  },
  vitalValue: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.xs,
    color: Colors.forest,
    textAlign: 'center',
  },
  labTable: {
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginTop: Spacing.xs,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSubtle,
    paddingVertical: 8,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
  tableHeadCol: {
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    fontSize: 10,
    color: Colors.muted,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
  tableRowAlt: {
    backgroundColor: '#fafbfc',
  },
  colParam: {
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    fontSize: Typography.fontSize.xs,
    color: Colors.ink,
  },
  colResult: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.xs,
    color: Colors.forest,
  },
  colUnit: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 9,
    color: Colors.muted,
  },
  colRange: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 10,
    color: Colors.muted,
  },
  rxSummary: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    lineHeight: Typography.lineHeight.sm,
    color: Colors.inkSoft,
    backgroundColor: Colors.surfaceSubtle,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  medCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  medIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  medInfo: {
    flex: 1,
  },
  medName: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.xs,
    color: Colors.ink,
  },
  medDosage: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 10,
    color: Colors.teal,
    marginTop: 1,
  },
  medDuration: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 9,
    color: Colors.muted,
  },
});
