import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Share,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import {
  MEDICAL_RECORDS,
  PATIENT_PROFILES,
  getRecordById,
  getRecordByBookingId,
} from '../../data/mockData';
import { MedicalRecordItem, LabResultItem, DetailedMedication } from '../../types';

type CategoryFilter = 'ALL' | 'PRESCRIPTION' | 'LAB_REPORT' | 'VITALS_LOG' | 'CARE_SUMMARY';

export default function RecordsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ recordId?: string; bookingId?: string; from?: string; category?: string }>();

  // Active View State: 'DASHBOARD' | 'DETAILS'
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(params.recordId || null);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(
    (params.category as CategoryFilter) || 'ALL'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Sync route params if changed
  useEffect(() => {
    if (params.recordId) {
      setSelectedRecordId(params.recordId);
    } else if (params.bookingId) {
      const linked = getRecordByBookingId(params.bookingId);
      if (linked) {
        setSelectedRecordId(linked.id);
      }
    }
  }, [params.recordId, params.bookingId]);

  // Notice timeout
  useEffect(() => {
    if (downloadNotice) {
      const timer = setTimeout(() => setDownloadNotice(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [downloadNotice]);

  // Current active detail record
  const currentRecord = useMemo(() => {
    if (!selectedRecordId) return null;
    return getRecordById(selectedRecordId) || MEDICAL_RECORDS[0];
  }, [selectedRecordId]);

  // Filtered records for dashboard
  const filteredRecords = useMemo(() => {
    return MEDICAL_RECORDS.filter((rec) => {
      // Patient Filter
      if (selectedPatientId !== 'ALL' && rec.patientId !== selectedPatientId) {
        return false;
      }
      // Category Filter
      if (selectedCategory !== 'ALL' && rec.recordType !== selectedCategory) {
        return false;
      }
      // Search Query
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = rec.serviceTitle.toLowerCase().includes(query);
        const matchClinician = rec.clinicianName.toLowerCase().includes(query);
        const matchDiagnosis = rec.diagnosis?.toLowerCase().includes(query) || false;
        const matchSummary = rec.summary.toLowerCase().includes(query);
        const matchMedication = rec.medications?.some((m) => m.name.toLowerCase().includes(query)) || false;
        const matchLab = rec.labResults?.some((l) => l.parameter.toLowerCase().includes(query)) || false;
        return matchTitle || matchClinician || matchDiagnosis || matchSummary || matchMedication || matchLab;
      }
      return true;
    });
  }, [selectedPatientId, selectedCategory, searchQuery]);

  // Document counts
  const counts = useMemo(() => {
    const rxCount = MEDICAL_RECORDS.filter((r) => r.recordType === 'PRESCRIPTION').length;
    const labCount = MEDICAL_RECORDS.filter((r) => r.recordType === 'LAB_REPORT').length;
    const vitalsCount = MEDICAL_RECORDS.filter((r) => r.recordType === 'VITALS_LOG').length;
    const summaryCount = MEDICAL_RECORDS.filter((r) => r.recordType === 'CARE_SUMMARY').length;
    return { rxCount, labCount, vitalsCount, summaryCount };
  }, []);

  const handleDownloadReport = (title: string, docType: string) => {
    setDownloadNotice(`${docType} export is unavailable in this demo. No file was saved.`);
  };

  const handleShareReport = async (record: MedicalRecordItem) => {
    try {
      await Share.share({
        title: record.serviceTitle,
        message: `Vellora Health Clinical Record:\n${record.serviceTitle}\nPatient: ${record.patientName} (${record.patientRelationship})\nDate: ${record.date}\nClinician: ${record.clinicianName}\nStatus: Demo record`,
      });
    } catch {
      setDownloadNotice('Sharing failed. Please try again.');
    }
  };

  // Helper for Clinical Flag Styling (Screen 17)
  const getFlagBadge = (status: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL') => {
    switch (status) {
      case 'NORMAL':
        return {
          bg: '#ECFDF5',
          text: '#059669',
          border: '#A7F3D0',
          icon: 'checkmark-circle-outline' as const,
          label: 'NORMAL',
        };
      case 'HIGH':
        return {
          bg: '#FEF3C7',
          text: '#B45309',
          border: '#FDE68A',
          icon: 'arrow-up-circle-outline' as const,
          label: 'HIGH',
        };
      case 'LOW':
        return {
          bg: '#FEF2F2',
          text: '#DC2626',
          border: '#FECACA',
          icon: 'arrow-down-circle-outline' as const,
          label: 'LOW',
        };
      case 'CRITICAL':
        return {
          bg: '#FFE4E6',
          text: '#BE123C',
          border: '#FDA4AF',
          icon: 'alert-circle-outline' as const,
          label: 'CRITICAL',
        };
    }
  };

  // -------------------------------------------------------------
  // RENDER: Screen 17 — Lab Report Details
  // -------------------------------------------------------------
  const renderLabDetails = (record: MedicalRecordItem) => {
    return (
      <View style={styles.detailContainer}>
        {/* Lab Header Summary Card */}
        <View style={styles.reportSummaryCard}>
          <View style={styles.summaryTopRow}>
            <View style={styles.verifiedLabBadge}>
              <Ionicons name="shield-checkmark" size={14} color={Colors.emerald} />
              <Text style={styles.verifiedLabText}>NABL ACCREDITED • ISO 15189</Text>
            </View>
            <View style={styles.statusPillVerified}>
              <Text style={styles.statusPillTextVerified}>VERIFIED</Text>
            </View>
          </View>

          <Text style={styles.detailReportTitle}>{record.serviceTitle}</Text>
          <Text style={styles.detailFacilityName}>
            <Ionicons name="business-outline" size={13} color={Colors.textSecondary} /> {record.facilityName || 'Metropolitan Central Diagnostics'}
          </Text>

          <View style={styles.reportMetaGrid}>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>PATIENT</Text>
              <Text style={styles.metaValue}>{record.patientName} ({record.patientRelationship})</Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>SAMPLE COLLECTED</Text>
              <Text style={styles.metaValue}>{record.sampleCollectionTime || record.date}</Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>REPORT DATE</Text>
              <Text style={styles.metaValue}>{record.date}</Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>SIGNING PATHOLOGIST</Text>
              <Text style={styles.metaValue}>{record.clinicianName}</Text>
            </View>
          </View>
        </View>

        {/* Bedside Baseline Vitals Card */}
        {record.vitals && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionIconCircle}>
                <Ionicons name="pulse" size={16} color={Colors.primary} />
              </View>
              <Text style={styles.sectionTitle}>Bedside Vitals Baseline</Text>
            </View>
            <Text style={styles.sectionCaption}>Hemodynamic vitals recorded during doorstep sample draw</Text>
            
            <View style={styles.vitalsRowGrid}>
              <View style={styles.vitalMetricBox}>
                <Text style={styles.vitalMetricLabel}>Blood Pressure</Text>
                <Text style={styles.vitalMetricVal}>{record.vitals.bloodPressure || '120/80 mmHg'}</Text>
                <Text style={styles.vitalMetricStatus}>Target: &lt;130/80</Text>
              </View>
              <View style={styles.vitalMetricBox}>
                <Text style={styles.vitalMetricLabel}>Pulse / HR</Text>
                <Text style={styles.vitalMetricVal}>{record.vitals.heartRate || '72 bpm'}</Text>
                <Text style={styles.vitalMetricStatus}>Normal: 60-100</Text>
              </View>
              <View style={styles.vitalMetricBox}>
                <Text style={styles.vitalMetricLabel}>Oxygen SpO2</Text>
                <Text style={styles.vitalMetricVal}>{record.vitals.oxygenSaturation || '98%'}</Text>
                <Text style={styles.vitalMetricStatus}>Target: &ge;95%</Text>
              </View>
              <View style={styles.vitalMetricBox}>
                <Text style={styles.vitalMetricLabel}>Fasting Glucose</Text>
                <Text style={styles.vitalMetricVal}>{record.vitals.bloodGlucose || '96 mg/dL'}</Text>
                <Text style={styles.vitalMetricStatus}>Normal: 70-99</Text>
              </View>
            </View>
          </View>
        )}

        {/* Lab Results Parameter Cards */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconCircle}>
              <Ionicons name="flask-outline" size={16} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Diagnostic Parameters</Text>
              <Text style={styles.sectionCaption}>Quantitative values with clinical reference ranges</Text>
            </View>
          </View>

          <View style={styles.parametersList}>
            {record.labResults?.map((item: LabResultItem, idx: number) => {
              const flag = getFlagBadge(item.status);
              return (
                <View key={idx} style={[styles.parameterCard, idx > 0 && styles.parameterCardBorder]}>
                  <View style={styles.paramHeaderRow}>
                    <View style={{ flex: 1, marginRight: Spacing.sm }}>
                      <Text style={styles.paramName}>{item.parameter}</Text>
                      {item.category && <Text style={styles.paramCategory}>{item.category}</Text>}
                    </View>
                    <View style={[styles.flagBadge, { backgroundColor: flag.bg, borderColor: flag.border }]}>
                      <Ionicons name={flag.icon} size={13} color={flag.text} style={{ marginRight: 3 }} />
                      <Text style={[styles.flagBadgeText, { color: flag.text }]}>{flag.label}</Text>
                    </View>
                  </View>

                  <View style={styles.paramValuesRow}>
                    <View style={styles.paramResultBox}>
                      <Text style={styles.paramResultLabel}>Observed Value</Text>
                      <Text style={styles.paramResultNumber}>
                        {item.result} <Text style={styles.paramUnit}>{item.unit}</Text>
                      </Text>
                    </View>

                    <View style={styles.paramRangeBox}>
                      <Text style={styles.paramRangeLabel}>Biological Reference Interval</Text>
                      <Text style={styles.paramRangeValue}>{item.referenceRange}</Text>
                    </View>
                  </View>

                  {item.interpretation && (
                    <View style={styles.interpretationBox}>
                      <Ionicons name="information-circle-outline" size={14} color={Colors.amber} />
                      <Text style={styles.interpretationText}>{item.interpretation}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Pathologist Clinical Summary */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconCircle}>
              <Ionicons name="reader-outline" size={16} color={Colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>Clinical Impression & Notes</Text>
          </View>
          <Text style={styles.clinicalNotesBody}>{record.summary}</Text>
          <View style={styles.signingRow}>
            <Ionicons name="ribbon-outline" size={16} color={Colors.primary} />
            <Text style={styles.signingText}>
              Digitally certified by {record.clinicianName} • Reg #{record.registrationNumber || 'KMC-PATH-49210'}
            </Text>
          </View>
        </View>

        {/* Primary Action Buttons */}
        <View style={styles.detailActionRow}>
          <TouchableOpacity accessibilityRole="button"
            style={styles.detailPrimaryBtn}
            activeOpacity={0.85}
            onPress={() => handleDownloadReport(record.serviceTitle, 'Lab Report')}
          >
            <Ionicons name="download-outline" size={18} color={Colors.textInverse} style={{ marginRight: 8 }} />
            <Text style={styles.detailPrimaryBtnText}>Download Lab PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity accessibilityRole="button"
            style={styles.detailSecondaryBtn}
            activeOpacity={0.85}
            onPress={() => handleShareReport(record)}
          >
            <Ionicons name="share-social-outline" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // -------------------------------------------------------------
  // RENDER: Screen 18 — Digital e-Prescriptions
  // -------------------------------------------------------------
  const renderPrescriptionDetails = (record: MedicalRecordItem) => {
    return (
      <View style={styles.detailContainer}>
        {/* Prescription Header Card */}
        <View style={styles.reportSummaryCard}>
          <View style={styles.summaryTopRow}>
            <View style={styles.verifiedLabBadge}>
              <Ionicons name="medical" size={14} color={Colors.primary} />
              <Text style={styles.verifiedLabText}>OFFICIAL e-PRESCRIPTION</Text>
            </View>
            <View style={styles.statusPillActive}>
              <Text style={styles.statusPillTextActive}>ACTIVE RX</Text>
            </View>
          </View>

          <Text style={styles.detailReportTitle}>{record.serviceTitle}</Text>
          
          <View style={styles.prescriberCard}>
            <View style={styles.prescriberAvatarBox}>
              <Ionicons name="person" size={20} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.prescriberName}>{record.clinicianName}</Text>
              <Text style={styles.prescriberRole}>{record.clinicianRole || 'Consultant General Physician'}</Text>
              <Text style={styles.prescriberReg}>Reg #{record.registrationNumber || 'KMC Reg # 84920'} • Vellora Clinical Network</Text>
            </View>
          </View>

          <View style={styles.reportMetaGrid}>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>PATIENT</Text>
              <Text style={styles.metaValue}>{record.patientName} ({record.patientRelationship})</Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>DATE PRESCRIBED</Text>
              <Text style={styles.metaValue}>{record.date}</Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>CLINICAL DIAGNOSIS</Text>
              <Text style={styles.metaValue}>{record.diagnosis || 'Acute Seasonal Bronchitis'}</Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>ENCOUNTER LINK</Text>
              <Text style={styles.metaValue}>Booking #{record.bookingId.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Diagnosis & Clinical Notes */}
        {record.chiefComplaint && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionIconCircle}>
                <Ionicons name="clipboard-outline" size={16} color={Colors.primary} />
              </View>
              <Text style={styles.sectionTitle}>Encounter & Clinical Presentation</Text>
            </View>
            <View style={styles.clinicalNotesBox}>
              <Text style={styles.notesLabel}>Chief Complaint:</Text>
              <Text style={styles.notesText}>{record.chiefComplaint}</Text>
              {record.clinicalNotes && (
                <>
                  <Text style={[styles.notesLabel, { marginTop: 8 }]}>Bedside Examination:</Text>
                  <Text style={styles.notesText}>{record.clinicalNotes}</Text>
                </>
              )}
            </View>
          </View>
        )}

        {/* Prescribed Medications List */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconCircle}>
              <Ionicons name="medkit-outline" size={16} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Prescribed Medications ({record.medications?.length || 0})</Text>
              <Text style={styles.sectionCaption}>Carefully follow dosage intervals and instructions</Text>
            </View>
          </View>

          <View style={styles.medicationsList}>
            {record.medications?.map((med: DetailedMedication, idx: number) => (
              <View key={idx} style={[styles.medicationCard, idx > 0 && styles.medicationCardBorder]}>
                <View style={styles.medHeaderRow}>
                  <View style={styles.medIndexCircle}>
                    <Text style={styles.medIndexText}>{idx + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.medicationName}>{med.name}</Text>
                    <Text style={styles.medicationType}>
                      {med.form || 'Tablet'} • {med.strength || 'Standard'} • {med.route || 'Oral'}
                    </Text>
                  </View>
                  <View style={styles.medDurationBadge}>
                    <Ionicons name="calendar-outline" size={12} color={Colors.textSecondary} />
                    <Text style={styles.medDurationText}>{med.duration}</Text>
                  </View>
                </View>

                {/* Dosage & Schedule Pills */}
                <View style={styles.dosageGrid}>
                  <View style={styles.dosageItem}>
                    <Text style={styles.dosageLabel}>Dosage:</Text>
                    <Text style={styles.dosageValue}>{med.dosage}</Text>
                  </View>
                  <View style={styles.dosageItem}>
                    <Text style={styles.dosageLabel}>Frequency:</Text>
                    <Text style={styles.dosageValue}>{med.frequency}</Text>
                  </View>
                </View>

                {/* Clinical Instructions */}
                {med.instructions && (
                  <View style={styles.medInstructionRow}>
                    <Ionicons name="information-circle" size={14} color={Colors.primary} />
                    <Text style={styles.medInstructionText}>{med.instructions}</Text>
                  </View>
                )}

                {/* Warnings */}
                {med.warnings && (
                  <View style={styles.medWarningRow}>
                    <Ionicons name="alert-circle" size={14} color={Colors.amber} />
                    <Text style={styles.medWarningText}>{med.warnings}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Doctor Advice & Follow-Up */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconCircle}>
              <Ionicons name="calendar" size={16} color={Colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>Doctor Advice & Follow-up</Text>
          </View>
          <Text style={styles.clinicalNotesBody}>
            {record.followUp || 'Follow-up consultation in 7 days if symptoms persist. Stay hydrated and avoid strenuous activities.'}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.detailActionRow}>
          <TouchableOpacity accessibilityRole="button"
            style={styles.detailPrimaryBtn}
            activeOpacity={0.85}
            onPress={() => handleDownloadReport(record.serviceTitle, 'e-Prescription')}
          >
            <Ionicons name="print-outline" size={18} color={Colors.textInverse} style={{ marginRight: 8 }} />
            <Text style={styles.detailPrimaryBtnText}>Download e-Rx PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity accessibilityRole="button"
            style={styles.detailSecondaryBtn}
            activeOpacity={0.85}
            onPress={() => handleShareReport(record)}
          >
            <Ionicons name="share-social-outline" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // -------------------------------------------------------------
  // RENDER: Screen 19 — Nursing Vitals Log & Visit Summary
  // -------------------------------------------------------------
  const renderVitalsAndSummaryDetails = (record: MedicalRecordItem) => {
    const isVitals = record.recordType === 'VITALS_LOG';

    return (
      <View style={styles.detailContainer}>
        {/* Summary Card */}
        <View style={styles.reportSummaryCard}>
          <View style={styles.summaryTopRow}>
            <View style={styles.verifiedLabBadge}>
              <Ionicons name={isVitals ? 'pulse' : 'document-text'} size={14} color={Colors.primary} />
              <Text style={styles.verifiedLabText}>
                {isVitals ? 'NURSING VITALS LOG' : 'CLINICAL VISIT SUMMARY'}
              </Text>
            </View>
            <View style={styles.statusPillVerified}>
              <Text style={styles.statusPillTextVerified}>VERIFIED</Text>
            </View>
          </View>

          <Text style={styles.detailReportTitle}>{record.serviceTitle}</Text>

          <View style={styles.prescriberCard}>
            <View style={styles.prescriberAvatarBox}>
              <Ionicons name={isVitals ? 'medkit' : 'person'} size={20} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.prescriberName}>{record.clinicianName}</Text>
              <Text style={styles.prescriberRole}>{record.clinicianRole || 'Healthcare Practitioner'}</Text>
              <Text style={styles.prescriberReg}>Reg #{record.registrationNumber || 'KNC-58914'} • {record.facilityName || 'Vellora Health'}</Text>
            </View>
          </View>

          <View style={styles.reportMetaGrid}>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>PATIENT</Text>
              <Text style={styles.metaValue}>{record.patientName} ({record.patientRelationship})</Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>RECORD DATE</Text>
              <Text style={styles.metaValue}>{record.date}</Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>STATUS</Text>
              <Text style={styles.metaValue}>Completed & Signed</Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>LINKED APPOINTMENT</Text>
              <Text style={styles.metaValue}>#{record.bookingId.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Detailed Hemodynamic Metrics Grid (Screen 19) */}
        {record.vitals && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionIconCircle}>
                <Ionicons name="fitness-outline" size={16} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Hemodynamic Metric Panel</Text>
                <Text style={styles.sectionCaption}>
                  {record.vitals.measuredAt ? `Measured at ${record.vitals.measuredAt}` : 'Measured during bedside care'}
                </Text>
              </View>
            </View>

            <View style={styles.vitalsFullGrid}>
              {/* Blood Pressure */}
              <View style={styles.vitalCardLarge}>
                <View style={styles.vitalCardHeader}>
                  <Ionicons name="heart" size={16} color="#DC2626" />
                  <Text style={styles.vitalCardTitle}>Blood Pressure</Text>
                </View>
                <Text style={styles.vitalCardValue}>{record.vitals.bloodPressure || '120/80 mmHg'}</Text>
                <Text style={styles.vitalCardTarget}>Target: &lt;130/80 mmHg</Text>
                <View style={[styles.vitalCardPill, { backgroundColor: '#ECFDF5' }]}>
                  <Text style={[styles.vitalCardPillText, { color: '#059669' }]}>STABLE</Text>
                </View>
              </View>

              {/* Heart Rate */}
              <View style={styles.vitalCardLarge}>
                <View style={styles.vitalCardHeader}>
                  <Ionicons name="pulse" size={16} color={Colors.primary} />
                  <Text style={styles.vitalCardTitle}>Heart Rate / Pulse</Text>
                </View>
                <Text style={styles.vitalCardValue}>{record.vitals.heartRate || '74 bpm'}</Text>
                <Text style={styles.vitalCardTarget}>Normal: 60-100 bpm</Text>
                <View style={[styles.vitalCardPill, { backgroundColor: '#ECFDF5' }]}>
                  <Text style={[styles.vitalCardPillText, { color: '#059669' }]}>NORMAL RHYTHM</Text>
                </View>
              </View>

              {/* Blood Oxygen */}
              <View style={styles.vitalCardLarge}>
                <View style={styles.vitalCardHeader}>
                  <Ionicons name="water-outline" size={16} color="#0284C7" />
                  <Text style={styles.vitalCardTitle}>Oxygen (SpO2)</Text>
                </View>
                <Text style={styles.vitalCardValue}>{record.vitals.oxygenSaturation || '97%'}</Text>
                <Text style={styles.vitalCardTarget}>Room Air Target: &ge;95%</Text>
                <View style={[styles.vitalCardPill, { backgroundColor: '#ECFDF5' }]}>
                  <Text style={[styles.vitalCardPillText, { color: '#059669' }]}>OPTIMAL</Text>
                </View>
              </View>

              {/* Blood Glucose */}
              <View style={styles.vitalCardLarge}>
                <View style={styles.vitalCardHeader}>
                  <Ionicons name="water" size={16} color="#D97706" />
                  <Text style={styles.vitalCardTitle}>Blood Glucose</Text>
                </View>
                <Text style={styles.vitalCardValue}>{record.vitals.bloodGlucose || '114 mg/dL'}</Text>
                <Text style={styles.vitalCardTarget}>Normal: 70-140 mg/dL</Text>
                <View style={[styles.vitalCardPill, { backgroundColor: '#ECFDF5' }]}>
                  <Text style={[styles.vitalCardPillText, { color: '#059669' }]}>NORMAL</Text>
                </View>
              </View>

              {/* Temperature */}
              <View style={styles.vitalCardLarge}>
                <View style={styles.vitalCardHeader}>
                  <Ionicons name="thermometer-outline" size={16} color="#E11D48" />
                  <Text style={styles.vitalCardTitle}>Body Temp</Text>
                </View>
                <Text style={styles.vitalCardValue}>{record.vitals.temperature || '98.4 °F'}</Text>
                <Text style={styles.vitalCardTarget}>Normal: 97.8 - 99.1 °F</Text>
                <View style={[styles.vitalCardPill, { backgroundColor: '#ECFDF5' }]}>
                  <Text style={[styles.vitalCardPillText, { color: '#059669' }]}>AFEBRILE</Text>
                </View>
              </View>

              {/* Respiratory Rate */}
              <View style={styles.vitalCardLarge}>
                <View style={styles.vitalCardHeader}>
                  <Ionicons name="speedometer-outline" size={16} color="#0D9488" />
                  <Text style={styles.vitalCardTitle}>Respiration</Text>
                </View>
                <Text style={styles.vitalCardValue}>{record.vitals.respiratoryRate || '16 /min'}</Text>
                <Text style={styles.vitalCardTarget}>Normal: 12-20 bpm</Text>
                <View style={[styles.vitalCardPill, { backgroundColor: '#ECFDF5' }]}>
                  <Text style={[styles.vitalCardPillText, { color: '#059669' }]}>EUPNEA</Text>
                </View>
              </View>
            </View>

            {/* Vitals Trend Analysis */}
            {record.vitals.trendNote && (
              <View style={styles.trendNoteBox}>
                <Ionicons name="trending-up" size={16} color={Colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.trendNoteTitle}>Clinical Trend Comparison</Text>
                  <Text style={styles.trendNoteText}>{record.vitals.trendNote}</Text>
                </View>
              </View>
            )}

            {/* Nurse Bedside Observations */}
            {record.vitals.notes && (
              <View style={styles.nurseNotesBox}>
                <Text style={styles.notesLabel}>Nurse Clinical Observation:</Text>
                <Text style={styles.notesText}>{record.vitals.notes}</Text>
              </View>
            )}
          </View>
        )}

        {/* Clinical Assessment & Doctor Notes for Care Summary */}
        {!isVitals && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionIconCircle}>
                <Ionicons name="document-text-outline" size={16} color={Colors.primary} />
              </View>
              <Text style={styles.sectionTitle}>Physical Examination & Diagnosis</Text>
            </View>

            {record.diagnosis && (
              <View style={styles.diagnosisPillBox}>
                <Text style={styles.diagnosisLabel}>Confirmed Diagnosis:</Text>
                <Text style={styles.diagnosisText}>{record.diagnosis}</Text>
              </View>
            )}

            <Text style={styles.clinicalNotesBody}>{record.clinicalNotes || record.summary}</Text>
          </View>
        )}

        {/* Linked Booking Deep Navigation */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconCircle}>
              <Ionicons name="link-outline" size={16} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Associated Service Encounter</Text>
              <Text style={styles.sectionCaption}>Completed visit on {record.date}</Text>
            </View>
          </View>

          <TouchableOpacity accessibilityRole="button"
            style={styles.linkedBookingButton}
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)/bookings')}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.linkedBookingTitle}>Appointment #{record.bookingId.toUpperCase()}</Text>
              <Text style={styles.linkedBookingSub}>View full care tracking timeline and receipt</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.detailActionRow}>
          <TouchableOpacity accessibilityRole="button"
            style={styles.detailPrimaryBtn}
            activeOpacity={0.85}
            onPress={() => handleDownloadReport(record.serviceTitle, isVitals ? 'Vitals Log' : 'Visit Summary')}
          >
            <Ionicons name="download-outline" size={18} color={Colors.textInverse} style={{ marginRight: 8 }} />
            <Text style={styles.detailPrimaryBtnText}>
              {isVitals ? 'Export Vitals Chart (PDF)' : 'Download Summary (PDF)'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity accessibilityRole="button"
            style={styles.detailSecondaryBtn}
            activeOpacity={0.85}
            onPress={() => handleShareReport(record)}
          >
            <Ionicons name="share-social-outline" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // -------------------------------------------------------------
  // RENDER: Screen 16 — Medical Records Dashboard
  // -------------------------------------------------------------
  const renderDashboard = () => {
    return (
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen 16: Top Header Section */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.mainTitle}>Medical Records</Text>
            <Text style={styles.mainSubtitle}>Your health information, all in one place.</Text>
          </View>
          <View style={styles.headerBadge}>
            <Ionicons name="shield-checkmark" size={16} color={Colors.primary} />
            <Text style={styles.headerBadgeText}>Verified EMR</Text>
          </View>
        </View>

        {/* Download notification toast if active */}
        {downloadNotice && (
          <View style={styles.toastBanner}>
            <Ionicons name="checkmark-circle" size={16} color="#059669" />
            <Text style={styles.toastText}>{downloadNotice}</Text>
          </View>
        )}

        {/* Patient Profile Selector Bar */}
        <View style={styles.patientSelectorSection}>
          <Text style={styles.sectionHeaderSmall}>PATIENT PROFILE</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.patientRow}>
            <TouchableOpacity accessibilityRole="button"
              style={[styles.patientPill, selectedPatientId === 'ALL' && styles.patientPillActive]}
              onPress={() => setSelectedPatientId('ALL')}
              activeOpacity={0.8}
            >
              <Text style={[styles.patientPillText, selectedPatientId === 'ALL' && styles.patientPillTextActive]}>
                All Patients ({MEDICAL_RECORDS.length})
              </Text>
            </TouchableOpacity>

            {PATIENT_PROFILES.map((pat) => {
              const isActive = selectedPatientId === pat.id;
              const count = MEDICAL_RECORDS.filter((r) => r.patientId === pat.id).length;
              return (
                <TouchableOpacity accessibilityRole="button"
                  key={pat.id}
                  style={[styles.patientPill, isActive && styles.patientPillActive]}
                  onPress={() => setSelectedPatientId(pat.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.patientPillText, isActive && styles.patientPillTextActive]}>
                    {pat.name} ({pat.relationship}) {count > 0 ? `• ${count}` : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 4 Category Cards Grid (Screen 16) */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionHeaderSmall}>CATEGORIES</Text>
          <View style={styles.categoryGrid}>
            {/* Prescriptions */}
            <TouchableOpacity accessibilityRole="button"
              style={[
                styles.categoryCard,
                selectedCategory === 'PRESCRIPTION' && styles.categoryCardSelected,
              ]}
              onPress={() => setSelectedCategory(selectedCategory === 'PRESCRIPTION' ? 'ALL' : 'PRESCRIPTION')}
              activeOpacity={0.85}
            >
              <View style={[styles.categoryIconCircle, { backgroundColor: '#E9F0E7' }]}>
                <Ionicons name="medkit" size={20} color={Colors.primary} />
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitle}>Prescriptions</Text>
                <Text style={styles.categorySub}>Active e-Rx & dosage</Text>
              </View>
              <View style={styles.categoryCountBadge}>
                <Text style={styles.categoryCountText}>{counts.rxCount}</Text>
              </View>
            </TouchableOpacity>

            {/* Lab Reports */}
            <TouchableOpacity accessibilityRole="button"
              style={[
                styles.categoryCard,
                selectedCategory === 'LAB_REPORT' && styles.categoryCardSelected,
              ]}
              onPress={() => setSelectedCategory(selectedCategory === 'LAB_REPORT' ? 'ALL' : 'LAB_REPORT')}
              activeOpacity={0.85}
            >
              <View style={[styles.categoryIconCircle, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="flask" size={20} color="#059669" />
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitle}>Lab Reports</Text>
                <Text style={styles.categorySub}>Diagnostic blood panels</Text>
              </View>
              <View style={styles.categoryCountBadge}>
                <Text style={styles.categoryCountText}>{counts.labCount}</Text>
              </View>
            </TouchableOpacity>

            {/* Nursing Vitals */}
            <TouchableOpacity accessibilityRole="button"
              style={[
                styles.categoryCard,
                selectedCategory === 'VITALS_LOG' && styles.categoryCardSelected,
              ]}
              onPress={() => setSelectedCategory(selectedCategory === 'VITALS_LOG' ? 'ALL' : 'VITALS_LOG')}
              activeOpacity={0.85}
            >
              <View style={[styles.categoryIconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="pulse" size={20} color="#D97706" />
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitle}>Nursing Vitals</Text>
                <Text style={styles.categorySub}>Bedside vitals log</Text>
              </View>
              <View style={styles.categoryCountBadge}>
                <Text style={styles.categoryCountText}>{counts.vitalsCount}</Text>
              </View>
            </TouchableOpacity>

            {/* Visit Summaries */}
            <TouchableOpacity accessibilityRole="button"
              style={[
                styles.categoryCard,
                selectedCategory === 'CARE_SUMMARY' && styles.categoryCardSelected,
              ]}
              onPress={() => setSelectedCategory(selectedCategory === 'CARE_SUMMARY' ? 'ALL' : 'CARE_SUMMARY')}
              activeOpacity={0.85}
            >
              <View style={[styles.categoryIconCircle, { backgroundColor: '#F0F9FF' }]}>
                <Ionicons name="document-text" size={20} color="#0284C7" />
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitle}>Visit Summaries</Text>
                <Text style={styles.categorySub}>Consultation reports</Text>
              </View>
              <View style={styles.categoryCountBadge}>
                <Text style={styles.categoryCountText}>{counts.summaryCount}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar & Filter Row */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={Colors.textMuted} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search tests, medications, clinicians..."
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity accessibilityRole="button" onPress={() => setSearchQuery('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Quick Filter Pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPillsRow}>
            {[
              { id: 'ALL', label: 'All Records' },
              { id: 'LAB_REPORT', label: 'Lab Reports' },
              { id: 'PRESCRIPTION', label: 'e-Prescriptions' },
              { id: 'VITALS_LOG', label: 'Nursing Vitals' },
              { id: 'CARE_SUMMARY', label: 'Visit Summaries' },
            ].map((pill) => {
              const isActive = selectedCategory === pill.id;
              return (
                <TouchableOpacity accessibilityRole="button"
                  key={pill.id}
                  style={[styles.filterPill, isActive && styles.filterPillActive]}
                  onPress={() => setSelectedCategory(pill.id as CategoryFilter)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                    {pill.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Clinical Records List */}
        <View style={styles.recordsListSection}>
          <View style={styles.recordsListHeader}>
            <Text style={styles.sectionHeaderSmall}>
              CLINICAL DOCUMENTS ({filteredRecords.length})
            </Text>
            {(selectedCategory !== 'ALL' || selectedPatientId !== 'ALL' || searchQuery.length > 0) && (
              <TouchableOpacity accessibilityRole="button"
                onPress={() => {
                  setSelectedCategory('ALL');
                  setSelectedPatientId('ALL');
                  setSearchQuery('');
                }}
              >
                <Text style={styles.clearFilterText}>Reset Filters</Text>
              </TouchableOpacity>
            )}
          </View>

          {filteredRecords.length === 0 ? (
            /* Empty State */
            <View style={styles.emptyStateCard}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="folder-open-outline" size={32} color={Colors.primary} />
              </View>
              <Text style={styles.emptyStateTitle}>No Records Found</Text>
              <Text style={styles.emptyStateSub}>
                There are no clinical documents matching your current filter criteria.
              </Text>
              <TouchableOpacity accessibilityRole="button"
                style={styles.emptyStateBtn}
                onPress={() => {
                  setSelectedCategory('ALL');
                  setSelectedPatientId('ALL');
                  setSearchQuery('');
                }}
              >
                <Text style={styles.emptyStateBtnText}>Show All Records</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredRecords.map((item) => {
              const isLab = item.recordType === 'LAB_REPORT';
              const isRx = item.recordType === 'PRESCRIPTION';
              const isVitals = item.recordType === 'VITALS_LOG';

              const badgeConfig = isLab
                ? { label: 'LAB REPORT', bg: '#ECFDF5', text: '#059669', icon: 'flask' as const }
                : isRx
                ? { label: 'e-PRESCRIPTION', bg: '#E9F0E7', text: Colors.primary, icon: 'medkit' as const }
                : isVitals
                ? { label: 'NURSING VITALS', bg: '#FEF3C7', text: '#D97706', icon: 'pulse' as const }
                : { label: 'VISIT SUMMARY', bg: '#F0F9FF', text: '#0284C7', icon: 'document-text' as const };

              return (
                <TouchableOpacity accessibilityRole="button"
                  key={item.id}
                  style={styles.recordCard}
                  activeOpacity={0.88}
                  onPress={() => setSelectedRecordId(item.id)}
                >
                  {/* Card Top Row */}
                  <View style={styles.cardTopRow}>
                    <View style={[styles.docTypeBadge, { backgroundColor: badgeConfig.bg }]}>
                      <Ionicons name={badgeConfig.icon} size={12} color={badgeConfig.text} style={{ marginRight: 4 }} />
                      <Text style={[styles.docTypeBadgeText, { color: badgeConfig.text }]}>{badgeConfig.label}</Text>
                    </View>
                    <Text style={styles.recordDate}>{item.date}</Text>
                  </View>

                  {/* Patient Tag */}
                  <View style={styles.patientTagRow}>
                    <Ionicons name="person-circle-outline" size={13} color={Colors.textSecondary} />
                    <Text style={styles.patientTagText}>
                      {item.patientName} • {item.patientRelationship}
                    </Text>
                  </View>

                  {/* Document Title */}
                  <Text style={styles.recordCardTitle}>{item.serviceTitle}</Text>

                  {/* Clinician / Provider */}
                  <Text style={styles.recordClinician}>
                    <Ionicons name="shield-checkmark-outline" size={12} color={Colors.primary} /> {item.clinicianName}
                  </Text>

                  {/* Clinical Snippet */}
                  <Text style={styles.recordSummarySnippet} numberOfLines={2}>
                    {item.summary}
                  </Text>

                  {/* Bottom Action Row */}
                  <View style={styles.cardFooterRow}>
                    <View style={styles.cardFooterLeft}>
                      {isLab && (
                        <Text style={styles.cardSubDetails}>
                          {item.labResults?.length || 5} parameters • Baseline vitals included
                        </Text>
                      )}
                      {isRx && (
                        <Text style={styles.cardSubDetails}>
                          {item.medications?.length || 2} medications prescribed • Digitally signed
                        </Text>
                      )}
                      {isVitals && (
                        <Text style={styles.cardSubDetails}>
                          BP: {item.vitals?.bloodPressure} • HR: {item.vitals?.heartRate} • SpO2: {item.vitals?.oxygenSaturation}
                        </Text>
                      )}
                    </View>

                    <View style={styles.viewDetailsPill}>
                      <Text style={styles.viewDetailsText}>View Details</Text>
                      <Ionicons name="arrow-forward" size={13} color={Colors.primary} />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    );
  };

  // -------------------------------------------------------------
  // MAIN RENDER WITH SAFE AREA & HEADER
  // -------------------------------------------------------------
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {selectedRecordId && currentRecord ? (
        /* Detailed Screen View (Screens 17, 18, 19) */
        <View style={styles.screenWrapper}>
          {/* Detail View Custom Header */}
          <View style={styles.detailHeaderBar}>
            <TouchableOpacity accessibilityRole="button"
              style={styles.backButton}
              activeOpacity={0.7}
              onPress={() => setSelectedRecordId(null)}
            >
              <Ionicons name="chevron-back" size={20} color={Colors.textPrimary} />
              <Text style={styles.backButtonText}>Records</Text>
            </TouchableOpacity>

            <Text style={styles.detailHeaderTitle} numberOfLines={1}>
              {currentRecord.recordType === 'LAB_REPORT'
                ? 'Lab Report'
                : currentRecord.recordType === 'PRESCRIPTION'
                ? 'e-Prescription'
                : currentRecord.recordType === 'VITALS_LOG'
                ? 'Nursing Vitals'
                : 'Visit Summary'}
            </Text>

            <TouchableOpacity accessibilityRole="button"
              style={styles.headerActionBtn}
              activeOpacity={0.7}
              onPress={() => handleShareReport(currentRecord)}
            >
              <Ionicons name="share-outline" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Download Notification Banner */}
          {downloadNotice && (
            <View style={styles.toastBanner}>
              <Ionicons name="checkmark-circle" size={16} color="#059669" />
              <Text style={styles.toastText}>{downloadNotice}</Text>
            </View>
          )}

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {currentRecord.recordType === 'LAB_REPORT' && renderLabDetails(currentRecord)}
            {currentRecord.recordType === 'PRESCRIPTION' && renderPrescriptionDetails(currentRecord)}
            {(currentRecord.recordType === 'VITALS_LOG' || currentRecord.recordType === 'CARE_SUMMARY') &&
              renderVitalsAndSummaryDetails(currentRecord)}
          </ScrollView>
        </View>
      ) : (
        /* Screen 16 Dashboard View */
        renderDashboard()
      )}
    </SafeAreaView>
  );
}

// -------------------------------------------------------------
// STYLES
// -------------------------------------------------------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenWrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.sm,
    paddingBottom: 110,
    backgroundColor: Colors.background,
  },

  // Dashboard Header
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  mainTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: '800',
    fontSize: 25,
    color: Colors.textPrimary,
    letterSpacing: -0.4,
  },
  mainSubtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E9F0E7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: '#D2DEC0',
  },
  headerBadgeText: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: 11,
    color: Colors.primary,
  },

  // Toast Notification Banner
  toastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    gap: 8,
  },
  toastText: {
    flex: 1,
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.xs,
    color: '#065F46',
  },

  // Patient Selector Section
  patientSelectorSection: {
    marginBottom: Spacing.md,
  },
  sectionHeaderSmall: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  patientRow: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: Spacing.md,
  },
  patientPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  patientPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  patientPillText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  patientPillTextActive: {
    color: Colors.textInverse,
    fontFamily: Typography.fontFamily.semibold,
  },

  // 4 Category Cards Grid
  categoriesSection: {
    marginBottom: Spacing.lg,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    flexBasis: '48%',
    flexGrow: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.subtle,
  },
  categoryCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#FAFDF9',
    borderWidth: 1.5,
  },
  categoryIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  categorySub: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 1,
  },
  categoryCountBadge: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.line,
  },
  categoryCountText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 11,
    color: Colors.primary,
  },

  // Search & Filters
  searchSection: {
    marginBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 44,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.sm,
    color: Colors.textPrimary,
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterPillText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  filterPillTextActive: {
    color: Colors.textInverse,
    fontFamily: Typography.fontFamily.semibold,
  },

  // Records List Section
  recordsListSection: {
    marginTop: Spacing.xs,
  },
  recordsListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  clearFilterText: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: 12,
    color: Colors.primary,
  },
  recordCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: 12,
    ...Shadows.card,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  docTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  docTypeBadgeText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 10,
    letterSpacing: 0.4,
  },
  recordDate: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 11,
    color: Colors.textMuted,
  },
  patientTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  patientTagText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  recordCardTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: 3,
  },
  recordClinician: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 12,
    color: Colors.primary,
    marginBottom: 6,
  },
  recordSummarySnippet: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
    marginBottom: 10,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.line,
    paddingTop: 8,
  },
  cardFooterLeft: {
    flex: 1,
    marginRight: 8,
  },
  cardSubDetails: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 10,
    color: Colors.textMuted,
  },
  viewDetailsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewDetailsText: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: 12,
    color: Colors.primary,
  },

  // Empty State
  emptyStateCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.xl,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E9F0E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  emptyStateTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: '700',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  emptyStateSub: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  emptyStateBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.pill,
  },
  emptyStateBtnText: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: 13,
    color: Colors.textInverse,
  },

  // -------------------------------------------------------------
  // DETAIL VIEWS COMMON STYLES (Screens 17, 18, 19)
  // -------------------------------------------------------------
  detailHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingRight: 8,
  },
  backButtonText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 14,
    color: Colors.textPrimary,
    marginLeft: 2,
  },
  detailHeaderTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: '700',
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'center',
    flex: 1,
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },

  detailContainer: {
    paddingBottom: Spacing.xl,
  },
  reportSummaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  verifiedLabBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E9F0E7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  verifiedLabText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 10,
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  statusPillVerified: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusPillTextVerified: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 10,
    color: '#059669',
  },
  statusPillActive: {
    backgroundColor: '#E9F0E7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: '#D2DEC0',
  },
  statusPillTextActive: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 10,
    color: Colors.primary,
  },
  detailReportTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: '800',
    fontSize: 18,
    color: Colors.textPrimary,
    lineHeight: 23,
    marginBottom: 4,
  },
  detailFacilityName: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  reportMetaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    gap: 12,
  },
  metaCell: {
    flexBasis: '46%',
  },
  metaLabel: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: 9,
    color: Colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  metaValue: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 12,
    color: Colors.textPrimary,
  },

  // Prescriber Card
  prescriberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.md,
    padding: 10,
    marginBottom: 12,
  },
  prescriberAvatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E9F0E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prescriberName: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  prescriberRole: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 11,
    color: Colors.primary,
  },
  prescriberReg: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 1,
  },

  // Sections
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E9F0E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: '700',
    fontSize: 15,
    color: Colors.textPrimary,
  },
  sectionCaption: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 10,
  },

  // Bedside Vitals Grid
  vitalsRowGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  vitalMetricBox: {
    flex: 1,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.md,
    padding: 8,
    alignItems: 'center',
  },
  vitalMetricLabel: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 9,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 2,
  },
  vitalMetricVal: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 12,
    color: Colors.primary,
    textAlign: 'center',
  },
  vitalMetricStatus: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 8,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },

  // Lab Parameters Cards (Screen 17)
  parametersList: {
    marginTop: 4,
  },
  parameterCard: {
    paddingVertical: 10,
  },
  parameterCardBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.line,
  },
  paramHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  paramName: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  paramCategory: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 1,
  },
  flagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
  },
  flagBadgeText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  paramValuesRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.sm,
    padding: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paramResultBox: {
    flex: 1,
  },
  paramResultLabel: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 9,
    color: Colors.textMuted,
  },
  paramResultNumber: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 14,
    color: Colors.primary,
    marginTop: 1,
  },
  paramUnit: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  paramRangeBox: {
    flex: 1.2,
    alignItems: 'flex-end',
  },
  paramRangeLabel: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 9,
    color: Colors.textMuted,
  },
  paramRangeValue: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 11,
    color: Colors.textPrimary,
    marginTop: 1,
  },
  interpretationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    padding: 6,
    borderRadius: BorderRadius.sm,
    marginTop: 6,
  },
  interpretationText: {
    flex: 1,
    fontFamily: Typography.fontFamily.regular,
    fontSize: 10,
    color: '#92400E',
    lineHeight: 14,
  },

  clinicalNotesBody: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 4,
  },
  signingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E9F0E7',
    padding: 8,
    borderRadius: BorderRadius.sm,
    marginTop: 10,
  },
  signingText: {
    flex: 1,
    fontFamily: Typography.fontFamily.medium,
    fontSize: 11,
    color: Colors.primary,
  },

  // Prescription Details (Screen 18)
  clinicalNotesBox: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.md,
    padding: 10,
    marginTop: 4,
  },
  notesLabel: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 11,
    color: Colors.textPrimary,
  },
  notesText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  medicationsList: {
    marginTop: 4,
  },
  medicationCard: {
    paddingVertical: 10,
  },
  medicationCardBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.line,
  },
  medHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  medIndexCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E9F0E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  medIndexText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 11,
    color: Colors.primary,
  },
  medicationName: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  medicationType: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 10,
    color: Colors.textMuted,
  },
  medDurationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  medDurationText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 10,
    color: Colors.textSecondary,
  },
  dosageGrid: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.sm,
    padding: 8,
    marginBottom: 6,
  },
  dosageItem: {
    flex: 1,
  },
  dosageLabel: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 9,
    color: Colors.textMuted,
  },
  dosageValue: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 11,
    color: Colors.textPrimary,
    marginTop: 1,
  },
  medInstructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FAFDF9',
    borderWidth: 1,
    borderColor: '#D2DEC0',
    borderRadius: BorderRadius.sm,
    padding: 6,
    marginBottom: 4,
  },
  medInstructionText: {
    flex: 1,
    fontFamily: Typography.fontFamily.regular,
    fontSize: 10,
    color: Colors.primary,
    lineHeight: 14,
  },
  medWarningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    borderRadius: BorderRadius.sm,
    padding: 6,
  },
  medWarningText: {
    flex: 1,
    fontFamily: Typography.fontFamily.regular,
    fontSize: 10,
    color: '#92400E',
    lineHeight: 14,
  },

  // Nursing Vitals Grid (Screen 19)
  vitalsFullGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
  },
  vitalCardLarge: {
    flexBasis: '48%',
    flexGrow: 1,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.line,
  },
  vitalCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  vitalCardTitle: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: 11,
    color: Colors.textPrimary,
  },
  vitalCardValue: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 15,
    color: Colors.primary,
    marginBottom: 2,
  },
  vitalCardTarget: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 9,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  vitalCardPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  vitalCardPillText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 8,
    letterSpacing: 0.5,
  },
  trendNoteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#E9F0E7',
    borderRadius: BorderRadius.md,
    padding: 10,
    marginTop: 10,
  },
  trendNoteTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 11,
    color: Colors.primary,
    marginBottom: 2,
  },
  trendNoteText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 15,
  },
  nurseNotesBox: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.md,
    padding: 10,
    marginTop: 10,
  },
  diagnosisPillBox: {
    backgroundColor: '#E9F0E7',
    padding: 8,
    borderRadius: BorderRadius.sm,
    marginBottom: 8,
  },
  diagnosisLabel: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 10,
    color: Colors.primary,
  },
  diagnosisText: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: 12,
    color: Colors.textPrimary,
    marginTop: 1,
  },
  linkedBookingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
  },
  linkedBookingTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 12,
    color: Colors.primary,
  },
  linkedBookingSub: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 1,
  },

  // Detail Action Buttons
  detailActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: Spacing.md,
  },
  detailPrimaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
    paddingVertical: 14,
    ...Shadows.subtle,
  },
  detailPrimaryBtnText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 14,
    color: Colors.textInverse,
  },
  detailSecondaryBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
});
